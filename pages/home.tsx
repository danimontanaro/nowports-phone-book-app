import { useState } from "react";
import type { NextPage } from "next";

import { Layout, Button, Row, List, Divider, Space } from "antd";
import {
  EditOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import { PrismaClient, Contact } from "@prisma/client";
import { dehydrate, QueryClient, useQuery, useQueryClient } from "react-query";
import styles from "../styles/Home.module.css";
import Header from "../src/commonComponents/header";
import React from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

import { CONTACTS_QUERY, FOOTER_DESCRIPTION } from "../src/constants";
import { getContacts } from "../src/api/contacts";

import ContactModal from "../src/contactModal/contactModal";
import DeleteContactModal from "../src/contactModal/contactDeleteModal";

const { Content, Footer, Sider } = Layout;

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
  await queryClient.prefetchQuery([CONTACTS_QUERY], async () => {
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
    const contacts = await prisma.contact.findMany({
      where: {
        userId,
      },
      select: {
        firstName: true,
        lastName: true,
        phone: true,
        id: true,
      },
    });
    return JSON.parse(JSON.stringify(contacts));
  });
  return {
    props: {
      userId,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

interface HomeArgs {
  userId: string;
}

const Home: NextPage<HomeArgs> = ({ userId }) => {
  // const queryClient = useQueryClient();
  const { data: sessionData } = useSession();

  const { data: contacts } = useQuery(
    [CONTACTS_QUERY],
    async () => {
      // TODO make getContacts
      const { data: contacts } = (await getContacts(userId)) as {
        data: Omit<Contact, "userId" | "user">[];
      };
      return contacts;
    },
    {
      enabled: false,
    }
  );

  const [contactSelected, setContactSelected] = useState<Contact>();

  const [showContactModal, setShowContactModal] = useState(false);

  const setListContactAfterDelete = (contactDeleted) => {
    console.log({ contactDeleted });
    return contacts.filter((contact) => contact.id !== contactDeleted);
  };

  const onCloseContactModal = () => {
    setShowContactModal(false);
    setContactSelected(null);
  };

  const onOpenContactModalEdit = (contact) => {
    setShowContactModal(true);
    setContactSelected(contact);
  };

  return (
    <Layout>
      <Header />
      <Layout>
        <Content className={styles.classContent}>
          <Row align="middle" justify="space-between"></Row>
          <div className={styles.classList}>
            <Divider />
            <List
              itemLayout="vertical"
              size="large"
              dataSource={contacts}
              renderItem={(contact) => (
                <>
                  <List.Item
                    className={styles.classListItem}
                    key={contact.id}
                    extra={
                      <Space direction="horizontal" size="large" align="center">
                        <Button
                          type="text"
                          icon={
                            <EditOutlined
                              style={{
                                fontSize: "30px",
                                color: "rgba(124, 130, 142, 0.6)",
                                cursor: "pointer",
                              }}
                            />
                          }
                          onClick={() => onOpenContactModalEdit(contact)}
                        />
                        <DeleteContactModal
                          selectedContact={contact}
                          setListContactAfterDelete={setListContactAfterDelete}
                        />
                      </Space>
                    }
                  >
                    <List.Item.Meta
                      title={
                        <Typography.Link
                          //href={`/play/${contact.id}`}
                          style={{
                            fontSize: "1.5rem",
                          }}
                        >
                          <UserOutlined
                            style={{
                              fontSize: "30px",
                              color: "#08c",
                              paddingRight: "30px",
                            }}
                          />
                          {contact.firstName} {contact.lastName}
                        </Typography.Link>
                      }
                    />
                  </List.Item>
                  <Divider />
                </>
              )}
            />

            <ContactModal
              visible={showContactModal}
              contacts={contacts}
              userId={userId}
              contactSelected={contactSelected}
              onSuccess={() => onCloseContactModal()}
              close={() => onCloseContactModal()}
            />
            <Button
              type="primary"
              icon={<PlusOutlined className={styles.createNewClassIcon} />}
              onClick={() => setShowContactModal(true)}
              style={{ width: "100%", height: "90px", fontSize: "1.5rem" }}
            >
              {!contacts?.length
                ? "Create your first Contacts!"
                : "Create Contact"}
            </Button>
          </div>
        </Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>{FOOTER_DESCRIPTION}</Footer>
      {/* 
      <FormContact
        handleFormSubmit={handleFormSubmit}
        contactSelected={contactSelected}
        form={form}
      /> */}
      {/* <CreateClassModal
        onSuccess={changeSelectedClass}
        close={() => setShowContactModal(false)}
        visible={isCreateClassModalVisible}
      /> */}
    </Layout>
  );
};

export default Home;
