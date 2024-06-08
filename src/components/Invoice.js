import React from "react";

const Invoice = React.forwardRef(({ formData, extra }, ref) => {
  const data = JSON.stringify(formData);
  const formatData = JSON.parse(data);
  const extraData = extra;

  // const vehicle = JSON.parse(formatData.vehicle);
  const make = "";
  const model = "";
  console.log("formatData", formatData);
  console.log("extraData", extraData);
  return (
    <div className="container" ref={ref}>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div>
                <img
                  src="https://www.linearity.io/blog/content/images/2023/06/how-to-create-a-car-NewBlogCover.png"
                  alt=""
                  className="w-[40px] h-[40px]"
                />
              </div>
              <div>
                RENTER INFO
                <p>
                  {formatData.firstName} {formatData.lastName}
                </p>
                <p>{formatData.email}</p>
                <p>PH: {formatData.phone}</p>
              </div>
            </div>
            <div>
              <p>CH Car Place Inc</p>
              <p>162 Bergen st</p> <p>Brooklyn, NY 11213 </p> <p>PH#</p>
              <div className="my-3 w-full">
                <p className="text-sm font-light">Monday 9:00 AM-6:00 PM </p>
                <p className="text-sm font-light">Tuesday 9:00 AM-6:00 PM </p>
                <p className="text-sm font-light">Wednesday 9:00 AM-6:00 PM</p>
                <p className="text-sm font-light">Thursday 9:00 AM-6:00 PM </p>
                <p className="text-sm font-light">Friday 9:00 AM-6:00 PM </p>
                <p className="text-sm font-light">Saturday 9:00 AM-6:00 PM </p>
                <p className="text-sm font-light">Sunday 9:00 AM-6:00 PM</p>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold">ADDITIONAL AUTHORIZED DRIVER(S)</h2>
          <div className="my-3">
            <h2 className="text-lg font-bold">UNIT DETAILS</h2>
            <p>
              Unit: {make} {model}
            </p>
            <p>
              Make & Model: {make} {model}
            </p>
          </div>
          <div className="my-3">
            <p>BILL TO:</p>
            <p>Payment Type: unpaid</p>
            <p>AUTH: $0.00</p>
          </div>
          <p>Referral:</p>
          <p>NOTICE: Collision Insurance (CDW)- $9 per day</p>
          <p className="text-justify">
            Limits liability of damages to one's own vehicle up to provides you
            coverage for rental vehicle damage or $1000 in event of an accident,
            by waiving this coverage renter agrees to be hold liable for damages
            up to the entire value of the vehicle.
          </p>
          <div className="flex justify-around items-center gap-5 my-3">
            <div>Accept</div> <div>Reject</div>
          </div>
          <p className="text-justify">
            Rental service may be refused anyone when done in the best interest
            of the renting company or customer - Rates do not include gasoline.
            - Reserves the right Additional Driver 1 to collect deposit covering
            estimated rental charges.
          </p>
        </div>
        <div>
          <h1 className="text-xl font-bold">Reservation</h1>
          <p>RA {formatData.reservationId}</p>
          <p>REPAIR ORDER:</p>
          <p>CLAIM:</p>
          <p>
            Date/Time Out: {new Date(formatData.pickupDate).toLocaleString()}
          </p>
          <p>
            Date/Time In: {new Date(formatData.returnDate).toLocaleString()}
          </p>
          <div className="bg-[#E6E6E3]">
            <h2 className="text-lg font-bold">CHARGE SUMMARY</h2>
            <table className="">
              <thead>
                <tr className="">
                  <th className="py-2 px-4 text-start"></th>
                  <th className="py-2 px-4 text-start">Unit</th>
                  <th className="py-2 px-4 text-start">Rate</th>
                  <th className="py-2 px-4 text-start">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4">Hourly</td>
                  <td className="py-2 px-4">{extraData.remainingHours || 0}</td>
                  <td className="py-2 px-4">
                    $
                    {extraData.selectedVehicle
                      ? extraData.selectedVehicle.rates.hourly
                      : 0}
                  </td>
                  <td className="py-2 px-4">${extraData.hourlyTotal}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Daily</td>
                  <td className="py-2 px-4">{extraData.remainingDays || 0}</td>
                  <td className="py-2 px-4">
                    $
                    {extraData.selectedVehicle
                      ? extraData.selectedVehicle.rates.daily
                      : 0}
                  </td>
                  <td className="py-2 px-4">${extraData.dailyTotal}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Weekly</td>
                  <td className="py-2 px-4">
                    {extraData.weeksDifference || 0}
                  </td>
                  <td className="py-2 px-4">
                    $
                    {extraData.selectedVehicle
                      ? extraData.selectedVehicle.rates.weekly
                      : 0}
                  </td>
                  <td className="py-2 px-4">${extraData.weeklyTotal}</td>
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
                          ? `${extraData.taxAmount?.toFixed(2)}`
                          : `${item.unit}${item.price}`}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="py-2 px-4 font-semibold" colSpan="3">
                    Discount
                  </td>
                  <td className="py-2 px-4 font-semibold">
                    ${formatData.discount}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-semibold" colSpan="3">
                    Total
                  </td>
                  <td className="py-2 px-4 font-semibold">
                    ${extraData.grandTotal - formatData.discount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-justify">
            Your rental agreement offers, for an additional charge, an optional
            waiver to cover all or a part of your responsibility for damage to
            or loss of the vehicle: Before deciding whether to purchase the
            waiver, you may wish to determine whether your own automobile
            insurance or credit card agreement provides you coverage for rental
            vehicle damage or loss and determine the amount of the deductible
            under your own insurance coverage. The purchase of the waiver is not
            mandatory. The waiver is not Insurance. I acknowledge that I have
            received and read a copy of this.
          </p>
          <div className="my-3">
            {" "}
            <p>Renters Signature</p>
            <p>----------------------------------------------------------</p>
          </div>
          <div className="my-3">
            <p>Additional Driver 1</p>
            <p>----------------------------------------------------------</p>
          </div>
        </div>
      </div>
    </div>
  );
});

Invoice.displayName = "Invoice";

export default Invoice;
