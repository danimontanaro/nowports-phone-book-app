import type { NextPage } from "next";
import { Layout } from "antd";
import { PrismaClient, Contact } from "@prisma/client";
import { dehydrate, QueryClient, useQuery } from "react-query";
import styles from "../styles/Home.module.css";
import Header from "../src/commonComponents/header";
import React from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

import {
  CONTACTS_QUERY,
  FOOTER_DESCRIPTION,
  ONE_HOUR_CACHE_TTL,
} from "../src/constants";
import { getContacts } from "../src/api/contacts";

import { getCache, saveCache } from "../src/utils/cache";

import HomePage from "../src/homePage";

const { Content, Footer } = Layout;

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const session: Session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }

  const queryClient = new QueryClient();
  let userId;

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if (!currentUser) {
    throw new Error(
      `User with email ${session.user.email} does not exist in the DB`
    );
  }
  userId = currentUser.id;

  return {
    props: {
      userId,
      // In case I want to load data from the backend
      dehydratedState: dehydrate(queryClient),
    },
  };
}

interface HomeArgs {
  userId: string;
}

const Home: NextPage<HomeArgs> = ({ userId }) => {
  const {
    data: contacts,
    isLoading,
    error,
  } = useQuery<Omit<Contact, "userId" | "user">[], Error>(
    [CONTACTS_QUERY],
    async () => {
      // TODO make getContacts
      const dataInCache: Omit<Contact, "userId" | "user">[] =
        getCache(CONTACTS_QUERY);

      if (!dataInCache) {
        const { data: contacts } = (await getContacts(userId)) as {
          data: Omit<Contact, "userId" | "user">[];
        };
        saveCache(CONTACTS_QUERY, contacts, ONE_HOUR_CACHE_TTL);
        return contacts;
      }
      return dataInCache;
    }
  );

  return (
    <Layout>
      <Header />
      <Layout>
        <Content className={styles.classContent}>
          <HomePage
            contacts={contacts}
            isLoading={isLoading}
            error={error}
            userId={userId}
          />
        </Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>{FOOTER_DESCRIPTION}</Footer>
    </Layout>
  );
};

export default Home;
