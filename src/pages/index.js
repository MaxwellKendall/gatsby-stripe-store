// TODO: https://docs.amplify.aws/lib/auth/social/q/platform/js#setup-frontend

import React from "react"
import Amplify, { Auth } from 'aws-amplify';
import { AmplifySignIn, AmplifySignOut } from "@aws-amplify/ui-react";


import awsconfig from '../aws-exports';
import Layout from "../components/layout"
import SEO from "../components/seo"
import Products from "../components/Products/Products"

Amplify.configure(awsconfig);

const AdvancedExamplePage = () => (
  <Layout>
      <AmplifySignIn federated={{ description: 'yo', type: 'facebook' }} />
      <SEO title="Shop" />
      <h1>This is the advanced example</h1>
      <Products />
  </Layout>
)

export default AdvancedExamplePage;
