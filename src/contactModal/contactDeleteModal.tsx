import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { DeleteOutlined } from "@ant-design/icons";
import { CONTACTS_QUERY, ONE_HOUR_CACHE_TTL } from "../../src/constants";

import { deleteContact } from "../../src/api/contact";
import { Contact } from "@prisma/client";
import { saveCache } from "../utils/cache";

interface DeleteContactModalArgs {
  contacts: Omit<Contact, "userId" | "user">[];
  contactSelected?: Omit<Contact, "userId" | "user">;
}

const DeleteContactModal = ({
  contactSelected,
  contacts,
}: DeleteContactModalArgs) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, mutate: handleDeleteContact } = useMutation(
    async (contact: Omit<Contact, "userId" | "user">) => {
      await deleteContact(contact.id);
    },
    {
      onError: (err) => {
        console.log(err);
      },

      onSuccess: () => {
        const newListContacts = contacts.filter(
          (contact) => contact.id !== contactSelected.id
        );
        const newData = [...newListContacts];
        queryClient.setQueryData([CONTACTS_QUERY], newData);
        saveCache(CONTACTS_QUERY, newData, ONE_HOUR_CACHE_TTL);
      },
    }
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleDeleteContactSelected = () => {
    setIsModalVisible(false);
    handleDeleteContact(contactSelected);
  };
  return (
    <>
      <Button
        loading={isLoading}
        danger
        icon={<DeleteOutlined />}
        onClick={showModal}
      />
      <Modal
        title="Delete Contact"
        visible={isModalVisible}
        onOk={handleDeleteContactSelected}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you want to delete this contact?</p>
      </Modal>
    </>
  );
};
export default DeleteContactModal;
