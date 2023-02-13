import React from "react"
import './style.css'

const ErrorPage = props => {
  return (
    <div className="wrapper">
      <p className="errorText404">404</p>
      <p className="errorText">Страница не найдена</p>
      <p className="errorText lightText">Страница, на которую вы пытаетесь попасть, не существует.</p>

    </div>
  )
}

export default ErrorPage