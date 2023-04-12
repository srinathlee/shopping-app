import {AiFillStar} from 'react-icons/ai'
import './index.css'

const SimilarProductItem = props => {
  const {each} = props
  const {
    id,
    imageUrl,
    title,
    price,
    description,
    brand,
    totalReviews,
    rating,
    availability,
    style,
  } = each

  return (
    <li className="similar-product-bg-container">
      <img alt="img" className="product-card-image" src={imageUrl} />
      <h1 className="product-card-heading">{title}</h1>
      <p className="product-card-maker">{brand}</p>
      <div className="product-price-rating-container">
        <p className="produce-card-price">Rs ${price}/- </p>
        <div className="product-rating-bg-container">
          <p className="product-card-rating">{rating}</p>
          <AiFillStar className="product-card-star-rating" />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
