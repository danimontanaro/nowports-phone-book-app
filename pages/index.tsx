import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Button, Layout, Menu } from "antd";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import {
  FOOTER_DESCRIPTION,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "../src/constants";

const { Content, Footer, Header } = Layout;

const Home: NextPage = () => {
  return (
    <Layout hasSider={false}>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header className="header">
        <div className="logo" /> {/** TODO: check add a LOGO */}
      </Header>

      <Layout hasSider>
        <Content className={styles.main}>
          <h1 className={styles.title}>
            Your <a href="https://nextjs.org">Contacts</a>
          </h1>

          <div className={styles.grid}>
            <h2>Start creating your own contact list</h2>
            <br />
          </div>
          <div>
            <Link href="/home">
              <Button>START NOW</Button>
            </Link>
          </div>
        </Content>
      </Layout>
      <Footer className={styles.footer}>{FOOTER_DESCRIPTION}</Footer>
    </Layout>
  );
};

export default Home;
