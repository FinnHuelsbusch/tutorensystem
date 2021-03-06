import { Button, Form, Input, message, Modal, } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Paragraph from 'antd/lib/typography/Paragraph';
import React, { useState } from 'react';
import { getRequestError, requestPasswordReset } from '../../api/api';
import { getErrorMessageString } from '../../types/RequestError';
import EmailFormInput from '../inputs/EmailFormInput';
import PasswordInput from '../inputs/PasswordInput';

type Props = {
    visible: boolean,
    onClose: () => void
}

const ForgotPasswordModal: React.FC<Props> = ({ visible, onClose }) => {

    const [form] = useForm();
    const [loading, setLoading] = useState(false);

    const onFormSubmit = (values: any) => {
        setLoading(true);
        requestPasswordReset(values.email, values.password)
            .then(res => {
                setLoading(false);
                message.success("E-Mail wurde zugesendet", 2);
                cleanupAndClose();
            }, err => {
                setLoading(false);
                const reqErr = getRequestError(err);
                message.error(getErrorMessageString(reqErr.errorCode));
            });
    }

    const cleanupAndClose = () => {
        onClose();
        form.resetFields();
    }

    return (
        <Modal
            title="Passwort vergessen?"
            visible={visible}
            onCancel={e => cleanupAndClose()}
            footer={[
                <Button
                    type='primary'
                    htmlType='submit'
                    onClick={e => form.submit()}
                    loading={loading}>
                    Passwort zurücksetzen
                </Button>
            ]}
            width={800}
        >
            <Form
                name="login"
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                onFinish={onFormSubmit}>

                <Paragraph>
                    Geben Sie die E-Mail Addresse Ihres bestehenden Kontos und ein neues Passwort an.
                    Folgen Sie dem Prozess in der E-Mail, die Ihnen anschließend zugesendet wird.
                </Paragraph>

                <EmailFormInput required disabled={loading} />

                <PasswordInput
                    disabled={loading}
                    customLabel="Neues Passwort"
                    withConfirmForm={form}
                />
            </Form>
        </Modal>
    )
};

export default ForgotPasswordModal;