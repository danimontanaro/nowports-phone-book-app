import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Router from "next/router";
import { Layout, Button, Image } from "antd";
import Header from "../src/commonComponents/header";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    const name = session.user.name.split(" ");
    await prisma.user.upsert({
      where: {
        email: session.user.email,
      },
      update: {},
      create: {
        firstName: name[0],
        lastName: name[1],
        email: session.user.email,
      },
    });
    return {
      redirect: {
        destination: "/home",
      },
    };
  }

  return {
    props: {},
  };
}

const LoginPage: NextPage = () => {
  const { data } = useSession();

  useEffect(() => {
    if (data) {
      Router.push("/home");
    }
  }, [data]);
  if (data) {
    return (
      <>
        <Image
          width={200}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
        Signed in as {data.user.email} <br />
        <Button block onClick={() => signOut()} style={{ padding: "10px" }}>
          Sign out
        </Button>
      </>
    );
  }
  return (
    <Layout>
      <Header isLogged={false} />
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Image
            width={200}
            src="https://madrerusia.com/wp-content/uploads/2017/10/920x312-Contacts-1.jpg"
          />
          {/*  Not signed in */} <br />
          <Button onClick={() => signIn()}>Sign in</Button>
        </div>
      </>
    </Layout>
  );
};

export default LoginPage;
