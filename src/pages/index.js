import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/Layout'
import SEO from '../components/Seo'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Link to="/fishes/">Fishes</Link>
    <Link to="/bugs/">Bugs</Link>
  </Layout>
)

export default IndexPage
