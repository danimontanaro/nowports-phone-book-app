import { useEffect } from "react";
import { Button, Form, Input, Modal, ModalProps, Space } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { Contact } from "@prisma/client";

import { CONTACTS_QUERY, ONE_HOUR_CACHE_TTL } from "../constants";
import { createOrUpdateContact } from "../api/contact";
import { saveCache } from "../utils/cache";

interface ContactModalProps extends ModalProps {
  close: () => void;
  onSuccess: () => void;
  contactSelected?: Omit<Contact, "userId" | "user">;
  contacts: Omit<Contact, "userId" | "user">[];
  userId: string;
}

const REQUIRED_FIELD_ERROR = "This field is required";

const ContactModal = ({
  contactSelected,
  contacts,
  userId,
  ...modalProps
}: ContactModalProps) => {
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  useEffect(() => {
    form.setFieldsValue(contactSelected);
    if (contactSelected == null) {
      form.setFieldsValue({
        firstName: "",
        lastName: "",
        phone: " ",
      });
    }
  }, [form, contactSelected]);

  const { mutate: handleCreateOrUpdateContacts, isLoading } = useMutation(
    async (contactObject: Omit<Contact, "user">) => {
      const response = await createOrUpdateContact(
        { ...contactSelected, ...contactObject },
        userId
      );
      const data = await response.json();
      return data;
    },
    {
      onError: (err) => {
        console.log(err);
      },

      onSuccess: (successData: { data: Omit<Contact, "userId" | "user"> }) => {
        let contactsToSave = contacts;
        if (contactSelected) {
          contactsToSave = contacts.filter(
            (contact) => contact.id !== contactSelected.id
          );
        }
        const newData = [...contactsToSave, { ...successData.data }];
        const sortedData = newData.sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );

        queryClient.setQueryData([CONTACTS_QUERY], sortedData);
        saveCache(CONTACTS_QUERY, newData, ONE_HOUR_CACHE_TTL);
        modalProps.onSuccess();
      },
    }
  );

  const handleFormSubmit = (value) => {
    handleCreateOrUpdateContacts({ ...value });
  };

  const onClose = () => {
    modalProps.close();
  };

  return (
    <Modal
      destroyOnClose
      footer={
        <Space>
          <Button
            loading={isLoading}
            block
            htmlType="submit"
            onClick={() => form.submit()}
            type="primary"
          >
            {contactSelected ? "Update Contact" : "Create Contact"}
          </Button>
        </Space>
      }
      onCancel={onClose}
      title={contactSelected ? "Update Contact" : "Create Contact"}
      width="50%"
      {...modalProps}
    >
      <Form
        form={form}
        onFinish={handleFormSubmit}
        initialValues={{
          firstName: contactSelected?.firstName,
          lastName: contactSelected?.lastName,
          phone: contactSelected?.phone,
        }}
      >
        <Form.Item
          label="Firstname"
          name="firstName"
          rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="LastName"
          name="lastName"
          rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              required: true,
              message: "Wrong phone number",
              pattern: new RegExp(/^[0-9]+$/),
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContactModal;
