export default function calculateByDiscount(amount, discount) {
    if (!discount) return amount

    if (discount.type == "fixed") return amount - discount.amount

    return amount - (amount * (discount.amount/100))
}