import React from "react";
import { useState } from "react";

import { Button, List, Divider, Space, Spin } from "antd";
import {
  EditOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
import { Contact } from "@prisma/client";

import ContactModal from "../../src/contactModal/contactModal";
import DeleteContactModal from "../../src/contactModal/contactDeleteModal";

import FetchFailure from "../../src/fetchFailure";
import styles from "./index.module.css";

interface HomePageArgs {
  contacts: Omit<Contact, "userId" | "user">[];
  isLoading?: boolean;
  error?: Error;
  userId: string;
}

export const CREATE_FIRST_CONTACT_TEXT = "Create your first Contacts!";
export const CREATE_CONTACT_TEXT = "Create Contact";

const HomePage = ({ contacts, isLoading, error, userId }: HomePageArgs) => {
  const [contactSelected, setContactSelected] = useState<Contact>();

  const [showContactModal, setShowContactModal] = useState(false);

  const onCloseContactModal = () => {
    setShowContactModal(false);
    setContactSelected(null);
  };

  const onOpenContactModalEdit = (contact) => {
    setShowContactModal(true);
    setContactSelected(contact);
  };

  if (error) {
    return <FetchFailure />;
  }

  return (
    <div className={styles.classList}>
      <Divider />
      {!error &&
        (isLoading ? (
          <Spin size="large" />
        ) : (
          <List
            itemLayout="vertical"
            size="large"
            dataSource={contacts}
            renderItem={(contact) => (
              <>
                <List.Item
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
                        contactSelected={contact}
                        contacts={contacts}
                      />
                    </Space>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <UserOutlined
                        style={{
                          fontSize: "30px",
                          color: "#08c",
                          paddingRight: "30px",
                        }}
                      />
                    }
                    description={
                      <>
                        <PhoneOutlined
                          style={{
                            // fontSize: "30px",
                            // color: "#08c",
                            paddingRight: "10px",
                          }}
                        />
                        {contact.phone}
                      </>
                    }
                    title={
                      <Typography.Link
                        //href={`/play/${contact.id}`}
                        style={{
                          fontSize: "1.5rem",
                        }}
                      >
                        {`${contact.firstName} ${contact.lastName}`}
                      </Typography.Link>
                    }
                  />
                </List.Item>
                <Divider />
              </>
            )}
          />
        ))}
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
        disabled={isLoading}
        onClick={() => setShowContactModal(true)}
        style={{ width: "100%", height: "90px", fontSize: "1.5rem" }}
      >
        {!contacts?.length ? CREATE_FIRST_CONTACT_TEXT : CREATE_CONTACT_TEXT}
      </Button>
    </div>
  );
};

export default HomePage;
