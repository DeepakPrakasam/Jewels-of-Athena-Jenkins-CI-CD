import Marquee from "react-fast-marquee";

function PriceTicker() {
  return (
    <div className="alert alert-success rounded-2">
    <marquee behavior="alternate" direction="left">
    Today: <strong>Date 12-05-25 Gold</strong> 22k - 1g = Rs. 8770 | Today: <strong>Silver</strong> 1g = Rs. 110.00 | Today: <strong>Platinum</strong> 1g = Rs. 3227
    </marquee>
    </div>

  );
}

export default PriceTicker;
