import React, { useCallback, useEffect, useRef, useState } from "react";
import { handleResource } from "../utils/APIRequester";
import TextInputField from "./FormFields/TextInputField";
import useForm from "./hooks/useForm";
import DatePickerInput from "./FormFields/DatePickerInput";
import SelectInput from "./FormFields/SelectInput";
import CheckBoxInput from "./FormFields/CheckBoxInput";
import Invoice from "./Invoice";
import { useReactToPrint } from "react-to-print";

const option = [
  { price: "9.00", item: "Collision Damage Waiver", unit: "$" },
  { price: "15.00", item: "Liability Insurance", unit: "$" },
  { price: "11.5", item: "Rental Tax", unit: "%" },
];

export default function ReservationForm() {
  const invoiceRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice `,
    pageStyle: "@page { size: A4; width: 100%; height: 100%; margin: 10mm;  }",
  });

  const { formData, handleChange, resetForm } = useForm({
    reservationId: "",
    pickupDate: "",
    returnDate: "",
    duration: "",
    discount: 0,
    vehicleType: "",
    vehicle: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    additionalCharges: [],
  });

  const [cars, setCarList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getList = async () => {
    try {
      setLoading(true);
      const result = await handleResource({
        method: "get",
        endpoint: "carsList",
      });
      setCarList(result.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  // unique vehicle type array
  const vehicleTypes = [...new Set(cars.map((item) => item.type))].map(
    (type) => ({ value: type, label: type })
  );

  //  filter vehicle array based on vehicle type
  const filteredVehicles = cars.filter(
    (item) => item.type === formData.vehicleType
  );

  // conversion date for calculation
  const pickupDate = new Date(formData.pickupDate);
  const returnDate = new Date(formData.returnDate);

  // calculate the difference in milliseconds between pickupDate and returnDate
  const timeDifference = returnDate.getTime() - pickupDate.getTime();

  // convert the time difference to hours, days, and weeks
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const weeksDifference = Math.floor(
    timeDifference / (1000 * 60 * 60 * 24 * 7)
  );

  // calculate the remaining hours after removing days and weeks
  const remainingHours = hoursDifference % 24;
  const remainingDays = daysDifference % 7;

  // calculation each and total price
  const selectedVehicle = formData.vehicle
    ? JSON.parse(formData.vehicle)
    : null;

  const hourlyTotal = selectedVehicle
    ? selectedVehicle.rates.hourly * remainingHours
    : 0;
  const dailyTotal = selectedVehicle
    ? selectedVehicle.rates.daily * remainingDays
    : 0;
  const weeklyTotal = selectedVehicle
    ? selectedVehicle.rates.weekly * weeksDifference
    : 0;

  const baseAmount = hourlyTotal + dailyTotal + weeklyTotal;

  // calculate additional charges price
  const additionalChargesTotal = formData.additionalCharges.reduce(
    (sum, item) => {
      const price = Number(item.price);

      if (isNaN(price)) {
        return sum;
      }

      if (item.item !== "Rental Tax") {
        return sum + price;
      }

      return sum;
    },
    0
  );

  // final calculation wit tax
  const taxItem = formData.additionalCharges.find(
    (item) => item.item === "Rental Tax"
  );
  const taxRate = taxItem ? parseFloat(taxItem.price / 100) : 0;
  const total = baseAmount + additionalChargesTotal;
  const taxAmount = total * taxRate;
  const grandTotal = parseFloat(total + taxAmount).toFixed(2);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const payload = {
        reservation_id: formData.reservationId,
        pickup_time: new Date(formData.pickupDate).toISOString(),
        return_time: new Date(formData.returnDate).toISOString(),
        discount: formData.discount || 0,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        vehicle_id: selectedVehicle.id,
        total_price: grandTotal,
        additional_charges: formData.additionalCharges,
      };
      // console.log("payload", payload);
      try {
        setLoading(true);
        await handleResource({
          method: "post",
          endpoint: `api/rent-book/`,
          data: payload,
          isMultipart: false,
          popupMessage: true,
          popupText: "Rent Booking Successful!",
        });
        setLoading(false);
        resetForm()
      } catch (error) {
        setLoading(false);
      }
    },
    [formData]
  );

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center text-2xl font-semibold">
          Loading...!
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-12">
        <div className="flex justify-between items-center gap-3 mb-3">
          <h1 className="font-bold text-xl">Reservation</h1>
          <button
            className="text-white bg-[#6576FF] px-6 py-2 rounded"
            onClick={handlePrint}
          >
            Print / Download
          </button>
          <div className="hidden">
            <Invoice
              formData={formData}
              ref={invoiceRef}
              extra={{
                weeksDifference,
                remainingHours,
                remainingDays,
                selectedVehicle,
                hourlyTotal,
                dailyTotal,
                weeklyTotal,
                taxAmount,
                grandTotal,
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-5">
            {/* Vehicle Info Column */}
            <div>
              <div className="mb-5">
                <div className="py-1 border-b-2 border-[#6576FF] font-semibold">
                  Reservation Details
                </div>
                <div className="border-2 border-[#DFDFFF] rounded p-3 my-2">
                  <div>
                    <TextInputField
                      placeholder=""
                      required={false}
                      title="Reservation ID"
                      onChange={(v) => handleChange("reservationId", v)}
                      value={formData.reservationId}
                      disabled={false}
                      type="text"
                      className="border-2 border-[#DFDFFF] rounded p-2 w-full"
                    />
                  </div>

                  <div>
                    <DatePickerInput
                      title="Pickup Date"
                      placeholder="Select date and time"
                      minDate={new Date()}
                      onChange={(v) =>
                        handleChange("pickupDate", new Date(v.target.value))
                      }
                      value={formData.pickupDate}
                      required={true}
                      className="border-2 border-[#DFDFFF] rounded p-2 w-full"
                    />
                  </div>
                  <div>
                    <DatePickerInput
                      title="Return Date"
                      placeholder="Select date and time"
                      minDate={new Date()}
                      onChange={(v) =>
                        handleChange("returnDate", new Date(v.target.value))
                      }
                      value={formData.returnDate}
                      required={true}
                      className="border-2 border-[#DFDFFF] rounded p-2 w-full"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-3">
                    <div className="font-light">Duration</div>
                    <div className="border-2 border-[#DFDFFF] rounded px-4 py-2 min-w-[250px] max-w-[150px] text-center">
                      {weeksDifference > 0 && `${weeksDifference} Week`}{" "}
                      {remainingDays > 0 && `${remainingDays} Day`}{" "}
                      {remainingHours > 0 && `${remainingHours} Hour`}
                    </div>
                  </div>

                  <div>
                    <TextInputField
                      placeholder=""
                      required={false}
                      title="Discount"
                      onChange={(v) => handleChange("discount", v)}
                      value={formData.discount}
                      disabled={false}
                      type="number"
                      className="border-2 border-[#DFDFFF] rounded p-2 w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <div className="py-1 border-b-2 border-[#6576FF] font-semibold">
                  Vehicle Information
                </div>

                <div className="border-2 border-[#DFDFFF] rounded p-3 my-2">
                  <div>
                    <SelectInput
                      placeholder=""
                      title="Vehicle Type"
                      options={vehicleTypes}
                      onChange={(v) => handleChange("vehicleType", v.value)}
                      required={true}
                      optionsType="objects"
                      value={formData.vehicleType}
                      className="border-2 border-[#DFDFFF] rounded p-3 my-2 w-full bg-white cursor-pointer"
                    />
                  </div>

                  <div>
                    <SelectInput
                      title="Vehicle"
                      options={filteredVehicles}
                      onChange={(v) => handleChange("vehicle", v)}
                      required={true}
                      optionsType="components"
                      value={formData?.vehicle.id}
                      disabled={!formData.vehicleType}
                      className={`border-2 border-[#DFDFFF] rounded p-3 my-2 w-full bg-white ${
                        formData.vehicleType ? "cursor-pointer" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Customer Info Column */}
            <div>
              <div className="mb-5">
                <div className="py-1 border-b-2 border-[#6576FF] font-semibold">
                  Customer Information
                </div>
                <div className="border-2 border-[#DFDFFF] rounded p-3 my-3">
                  <div>
                    <TextInputField
                      placeholder=""
                      required={true}
                      title="First Name"
                      onChange={(v) => handleChange("firstName", v)}
                      value={formData.firstName}
                      disabled={false}
                      type="text"
                      className="border-2 border-[#DFDFFF] rounded p-2 w-full"
                    />
                  </div>

                  <div>
                    <TextInputField
                      placeholder=""
                      required={true}
                      title="Last Name"
                      onChange={(v) => handleChange("lastName", v)}
                      value={formData.lastName}
                      disabled={false}
                      type="text"
                      className="border-2 border-[#DFDFFF] rounded p-2 w-full"
                    />
                  </div>

                  <div>
                    <TextInputField
                      placeholder=""
                      required={true}
                      title="Email"
                      onChange={(v) => handleChange("email", v)}
                      value={formData.email}
                      disabled={false}
                      type="email"
                      className="border-2 border-[#DFDFFF] rounded p-2 w-full"
                    />
                  </div>

                  <div>
                    <TextInputField
                      placeholder=""
                      required={true}
                      title="Phone"
                      onChange={(v) => handleChange("phone", v)}
                      value={formData.phone}
                      disabled={false}
                      type="tel"
                      className="border-2 border-[#DFDFFF] rounded p-2 w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <div className="py-1 border-b-2 border-[#6576FF] font-semibold">
                  Additional Charges
                </div>

                <div className="border-2 border-[#DFDFFF] rounded p-3 my-3">
                  <div>
                    <CheckBoxInput
                      title=""
                      options={option}
                      selectedOptions={formData.additionalCharges}
                      onChange={(v) => handleChange("additionalCharges", v)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Column */}
            <div className="mb-5">
              <div className="py-1 border-b-2 border-[#6576FF] font-semibold">
                Charges Summary
              </div>
              <div className="border-2 border-[#6576FF] bg-[#DFDFFF] rounded p-3 my-3">
                <table className="w-full">
                  <thead>
                    <tr className="">
                      <th className="py-2 px-4 text-start">Charges</th>
                      <th className="py-2 px-4 text-start">Unit</th>
                      <th className="py-2 px-4 text-start">Rate</th>
                      <th className="py-2 px-4 text-start">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4">Hourly</td>
                      <td className="py-2 px-4">{remainingHours || 0}</td>
                      <td className="py-2 px-4">
                        ${selectedVehicle ? selectedVehicle.rates.hourly : 0}
                      </td>
                      <td className="py-2 px-4">${hourlyTotal}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">Daily</td>
                      <td className="py-2 px-4">{remainingDays || 0}</td>
                      <td className="py-2 px-4">
                        ${selectedVehicle ? selectedVehicle.rates.daily : 0}
                      </td>
                      <td className="py-2 px-4">${dailyTotal}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">Weekly</td>
                      <td className="py-2 px-4">{weeksDifference || 0}</td>
                      <td className="py-2 px-4">
                        ${selectedVehicle ? selectedVehicle.rates.weekly : 0}
                      </td>
                      <td className="py-2 px-4">${weeklyTotal}</td>
                    </tr>
                    {formData.additionalCharges &&
                      formData.additionalCharges.map((item, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4" colSpan="2">
                            {item.item}
                          </td>
                          <td className="py-2 px-4">
                            {item.item === "Rental Tax"
                              ? `${item.price}${item.unit}`
                              : `${item.unit}${item.price}`}
                          </td>
                          <td className="py-2 px-4">
                            {item.item === "Rental Tax"
                              ? `${taxAmount?.toFixed(2)}`
                              : `${item.unit}${item.price}`}
                          </td>
                        </tr>
                      ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td className="py-2 px-4 font-semibold" colSpan="3">
                        Sub Total
                      </td>
                      <td className="py-2 px-4 font-semibold">
                        ${grandTotal}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-semibold" colSpan="3">
                        Discount
                      </td>
                      <td className="py-2 px-4 font-semibold">
                        -${formData.discount}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-semibold" colSpan="3">
                        Total
                      </td>
                      <td className="py-2 px-4 font-semibold">
                        ${(grandTotal - formData.discount).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mb-5">
                <div className="border-2 border-[#6576FF] rounded  my-3">
                  <button
                    className="bg-[#DFDFFF] px-8 py-4 rounded w-full text-[#2A52B9] font-medium"
                    type="submit"
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
