import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import ProductCard from "./ProductCard"

const containerStyles = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  padding: "1rem 0 1rem 0",
}


const Products = () => {
  const {
    prices: {
      nodes: productPrices
    },
    imgs: {
      nodes: imgs
    }} = useStaticQuery(graphql`
    query Products {
      prices: allStripePrice(
        filter: { active: { eq: true } }
        sort: { fields: [unit_amount] }
      ) {
        nodes {
          id
          active
          currency
          unit_amount
          product {
            id
            name
          }
        }
      }
      imgs: allStripeProduct(
        filter: { active: { eq: true } }
      ) {
        nodes {
          id
          name
          imgs: localFiles {
            childImageSharp {
              fluid(maxWidth: 300) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `)

  const products = imgs
    .map(({ id: productId, name, imgs }) => {
      const prices = productPrices.filter(({ product: { id } }) => id === productId)
      return {
        productId,
        name,
        prices,
        imgs: imgs ? imgs.map((img) => img?.childImageSharp?.fluid) : []
      }
    })
  
  return (
    <div style={containerStyles}>
      {products.map(({ name, imgs, productId, prices }) => (
        <ProductCard
          img={imgs[0]}
          key={productId}
          name={name}
          prices={prices} />
      ))}
    </div>
  );
};


export default Products