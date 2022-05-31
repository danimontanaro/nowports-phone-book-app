import FC, { useEffect } from "react";
import { Button, Form, Input, Modal, ModalProps, Space } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import { Contact } from "@prisma/client";
import { SaveOutlined } from "@ant-design/icons";
import { CONTACTS_QUERY } from "../constants";
import { createOrUpdateContact } from "../api/contact";

interface ContactModalProps extends ModalProps {
  close: () => void;
  onSuccess: () => void;
  contactSelected?: Omit<Contact, "userId" | "user">;
  contacts: Omit<Contact, "userId" | "user">[];
  userId: string;
}

interface CreateClassData {
  name: string;
  userEmail: string;
}

const REQUIRED_FIELD_ERROR = "This field is required";

const ContactModal: FC<ContactModalProps> = ({
  contactSelected,
  contacts,
  userId,
  ...modalProps
}) => {
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
      const response = await createOrUpdateContact(contactObject, userId);
      const data = await response.json();
      return data;
    },
    {
      onError: (err) => {
        console.log(err);
      },
      onSettled: () => {
        queryClient.invalidateQueries([CONTACTS_QUERY]);
      },

      onSuccess: (successData: { data: Omit<Contact, "userId" | "user"> }) => {
        let contactsToSave = contacts;
        if (contactSelected) {
          contactsToSave = contacts.filter(
            (contact) => contact.id !== contactSelected.id
          );
        }
        queryClient.setQueryData(
          [CONTACTS_QUERY],
          [...contactsToSave, { ...successData.data }]
        );
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
  console.log({ contactSelected });
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
