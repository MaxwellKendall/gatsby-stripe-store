import React, { useState } from "react"
import Img from "gatsby-image";
import getStripe from "../../utils/stripejs"

const cardStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "flex-start",
  padding: "1rem",
  marginBottom: "1rem",
  boxShadow: "5px 5px 25px 0 rgba(46,61,73,.2)",
  backgroundColor: "#fff",
  borderRadius: "6px",
  maxWidth: "300px",
}
const buttonStyles = {
  display: "block",
  fontSize: "13px",
  textAlign: "center",
  color: "#000",
  padding: "12px",
  boxShadow: "2px 5px 10px rgba(0,0,0,.1)",
  backgroundColor: "rgb(255, 178, 56)",
  borderRadius: "6px",
  letterSpacing: "1.5px",
}

const buttonDisabledStyles = {
  opacity: "0.5",
  cursor: "not-allowed",
}

const formatPrice = (amount, currency) => {
  let price = (amount / 100).toFixed(2)
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  })
  return numberFormat.format(price)
}

const ProductCard = ({
  name,
  prices,
  img
 }) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const price = new FormData(e.target).get("priceSelect")
    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price, quantity: 1 }],
      successUrl: `${window.location.origin}/page-2/`,
      cancelUrl: `${window.location.origin}/advanced`,
    })

    if (error) {
      console.warn("Error:", error)
      setLoading(false)
    }
  }
  return (
    <div style={cardStyles}>
      <form onSubmit={handleSubmit}>
        <fieldset style={{ border: "none" }}>
          <legend>
            <h4>{name}</h4>
          </legend>
          <Img fluid={img} />
          <label>
            Price{" "}
            <select name="priceSelect">
              {prices.map(({ id: priceId, unit_amount: price, currency }) => ( 
                <option key={priceId} value={priceId}>
                  {formatPrice(price, currency)}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
        <button
          disabled={loading}
          style={
            loading
              ? { ...buttonStyles, ...buttonDisabledStyles }
              : buttonStyles
          }
        >
          BUY ME
        </button>
      </form>
    </div>
  )
}

export default ProductCard