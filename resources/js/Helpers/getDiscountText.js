export default function getDiscountText(discount) {
    return (discount.type == "fixed" ? "GHȻ" : "") + `${discount.amount} ${discount.type}`
}