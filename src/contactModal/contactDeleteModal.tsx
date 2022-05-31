import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { DeleteOutlined } from "@ant-design/icons";
import { CONTACTS_QUERY } from "../../src/constants";

import { deleteContact } from "../../src/api/contact";
import { Contact } from "@prisma/client";

const DeleteContactModal = ({ selectedContact, setListContactAfterDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    mutate: handleDeleteContact,
  } = useMutation(
    async (contact: Contact) => {
      const response = await deleteContact(contact.id);
      const data = await response.json();
      return data;
    },
    {
      onError: (err) => {
        console.log(err);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries([CONTACTS_QUERY]);
      },

      onSuccess: () => {
        const newListContacts = setListContactAfterDelete(selectedContact.id);
        queryClient.setQueryData([CONTACTS_QUERY], [...newListContacts]);
      },
    }
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleDeleteContactSelected = () => {
    setIsModalVisible(false);
    handleDeleteContact(selectedContact);
  };
  return (
    <>
      <Button danger icon={<DeleteOutlined />} onClick={showModal} />
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
