import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  INITIAL: 'initila',
  SUCCESS: 'success',
  FAILURE: 'failure',
  LOADING: 'loading',
}

class ProductItemDetails extends Component {
  state = {
    productsCount: 1,
    productDetails: [],
    dataStatus: apiStatusConstants.INITIAL,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const {history, match} = this.props
    const {params} = match
    const {id} = params
    console.log(id, params)
    this.setState({dataStatus: apiStatusConstants.LOADING})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      const newData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(each => ({
          id: each.id,
          imageUrl: each.image_url,
          title: each.title,
          style: each.style,
          price: each.price,
          description: each.description,
          brand: each.brand,
          totalReviews: each.total_reviews,
          rating: each.rating,
          availability: each.availability,
        })),
      }
      this.setState({
        productDetails: newData,
        dataStatus: apiStatusConstants.SUCCESS,
      })
    } else {
      this.setState({dataStatus: apiStatusConstants.FAILURE})
    }
  }

  failureView = () => (
    <div className="failure-bg-container">
      <img
        alt="failure view"
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
      />
      <h1 className="failure-para">Product Not Found</h1>
      <Link to="/products">
        <button className="continue-shoping-button">Continue Shopping</button>
      </Link>
    </div>
  )

  incrementProduct = () =>
    this.setState(prevState => ({productsCount: prevState.productsCount + 1}))

  decrementProduct = () => {
    const {productsCount} = this.state
    if (productsCount < 1) {
      this.setState({productsCount: 0})
    } else {
      this.setState(prevState => ({productsCount: prevState.productsCount - 1}))
    }
  }

  loadingView = () => (
    <div className="loader-bg-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  successClickedProductView = newData => {
    const {productDetails} = this.state
    let {productsCount} = this.state
    if (productsCount < 0) {
      productsCount = 0
    }
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
      similarProducts,
    } = productDetails
    console.log(similarProducts)
    return (
      <div className="outer-click-product-bg-container">
        <div className="clicked-product-bg-container">
          <img alt="product" className="clicked-product-img" src={imageUrl} />

          <div className="clicked-product-description">
            <h1 className="detailview-heading">{title}</h1>
            <p className="detailview-price">{`Rs ${price}/-`} </p>
            <div className="detailview-rating-reviews-container">
              <div className="rating-bg-container">
                <p className="product-rating">{rating}</p>
                <AiFillStar className="product-star-rating" />
              </div>
              <p className="reviews-para"> {`${totalReviews} Reviews`}</p>
            </div>
            <p className="about-product">{description}</p>
            <div className="available-container">
              <h1 className="abailable-heading">Available:</h1>
              <p className="abailable-value">{availability}</p>
            </div>
            <div className="brand-container">
              <h1 className="brand-heading">Brand:</h1>
              <p className="brand-value">{brand}</p>
            </div>
            <hr className="horizontal-line" />
            <div className="product-count-bg-container">
              <button
                onClick={this.decrementProduct}
                data-testid="minus"
                type="button"
                className="decrement-product"
              >
                -
              </button>
              <p className="product-count">{productsCount}</p>
              <button
                onClick={this.incrementProduct}
                data-testid="plus"
                type="button"
                className="increment-product"
              >
                +
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <ul className="similar-products-bg-container">
          {similarProducts.map(each => (
            <SimilarProductItem key={each.id} each={each} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {dataStatus} = this.state

    switch (dataStatus) {
      case apiStatusConstants.SUCCESS:
        return this.successClickedProductView()

      case apiStatusConstants.FAILURE:
        return this.failureView()

      case apiStatusConstants.LOADING:
        return this.loadingView()

      default:
        return null
    }
  }
}

export default ProductItemDetails
