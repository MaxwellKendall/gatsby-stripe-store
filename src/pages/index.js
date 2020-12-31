// TODO: https://docs.amplify.aws/lib/auth/social/q/platform/js#setup-frontend

import React, { useContext, useEffect } from "react"
import Amplify, { Hub, Auth } from 'aws-amplify';
import { AmplifySignOut } from "@aws-amplify/ui-react";

import awsconfig from '../aws-exports';
import Layout from "../components/layout"
import SEO from "../components/seo"
import Products from "../components/Products/Products"
import GlobalState from "../store";

Amplify.configure(awsconfig);

const Home = () => {
  const { store, dispatch } = useContext(GlobalState);

  return (
    <Layout>
      <SEO title="Shop" />
      <Products />
    </Layout>
  )
}


export default Home;
