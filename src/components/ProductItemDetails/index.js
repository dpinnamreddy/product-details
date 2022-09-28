// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    isLoading: true,
    isError: false,
    count: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    console.log('Here')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      console.log(data)
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products,
        style: data.style,
        price: data.price,
        description: data.description,
      }
      this.setState({
        productDetails: updatedData,
        isLoading: false,
        isError: false,
      })
    } else {
      this.setState({isError: true, isLoading: false})
    }
  }

  reduceCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  increaseCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  redirectToProd = () => {
    const {history} = this.props
    history.replace('/products')
  }

  render() {
    const {productDetails, isLoading, isError, count} = this.state
    const {imageUrl} = productDetails
    return (
      <>
        <Header />
        {isLoading ? (
          <div testid="loader">
            <Loader />
          </div>
        ) : (
          <div className="container">
            {isError ? (
              <>
                <h1>Product Not Found</h1>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
                  alt="failure view"
                />
                <button type="button" onClick={this.redirectToProd}>
                  Continue Shopping
                </button>
              </>
            ) : (
              <>
                <div className="product-card">
                  <img src={imageUrl} alt="product" />
                  <div className="text">
                    <h1>{productDetails.title}</h1>
                    <p>{productDetails.price}</p>
                    <div className="sub">
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                        alt="star"
                      />
                      <p>{productDetails.rating}</p>
                      <p>{productDetails.totalReviews} Reviews</p>
                    </div>
                    <p>{productDetails.description}</p>
                    <p>Available: {productDetails.availability}</p>
                    <p>Brand: {productDetails.brand}</p>
                    <div className="counter">
                      <button
                        type="button"
                        onClick={this.reduceCount}
                        testid="minus"
                      >
                        <BsDashSquare />
                      </button>
                      <p>{count}</p>
                      <button
                        type="button"
                        onClick={this.increaseCount}
                        testid="plus"
                      >
                        <BsPlusSquare />
                      </button>
                    </div>
                    <button type="button">ADD TO CART</button>
                  </div>
                </div>
                <ul className="similarProds">
                  {productDetails.similarProducts.map(simProd => (
                    <Link to={`/products/${simProd.id}`} key={simProd.id}>
                      <li className="SimItem">
                        <img src={simProd.image_url} alt="similar product" />
                        <h1>{simProd.title}</h1>
                        <p>by {simProd.brand}</p>
                        <div>
                          <p>{simProd.price}</p>
                          <p>{simProd.rating}</p>
                          <img
                            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                            alt="star"
                          />
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </>
    )
  }
}

export default ProductItemDetails
