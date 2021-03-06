import { Button, Divider, Form, Layout, message } from 'antd';
import React, { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { performPasswordReset } from '../../api/api';
import { AppRoutes } from '../../types/AppRoutes';
import { AuthContext } from '../../context/UserContext';
import EmailFormInput from '../inputs/EmailFormInput';
import Paragraph from 'antd/lib/typography/Paragraph';
import { Content } from 'antd/lib/layout/layout';
import PasswordInput from '../inputs/PasswordInput';

const VerifyResetPassword: React.FC = () => {

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);

    const handleVerifyError = (messageStr: string) => {
        navigate(AppRoutes.Unauthorized);
        message.error(messageStr);
    };

    const onSubmit = (values: any) => {
        const hash = searchParams.get("h");
        const email = searchParams.get("e");
        if (!hash || !email) {
            handleVerifyError("Ein Fehler ist aufgetreten.");
        }
        setLoading(true);
        performPasswordReset(hash, email, values.password)
            .then(user => {
                navigate(AppRoutes.Main.Path);
                setLoading(false);
                authContext.login(user);
                message.success("Passwort erfolgreich geändert", 2);
            }).catch(err => {
                message.error("Verifizierung fehlgeschlagen");
                setLoading(false);
            });
    }

    return (
        <>
            <Layout>
                <Content style={{
                    marginLeft: '20%',
                    marginRight: '20%',
                    marginTop: '10vh',
                    marginBottom: '70vh'
                }}>
                    <Form
                        name="login"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                        initialValues={{ email: searchParams.get("e") }}
                        onFinish={onSubmit}>

                        <Paragraph>
                            Geben Sie bitte das Passwort ein, das Sie zuvor neu gesetzt haben.
                        </Paragraph>

                        <Divider />

                        <EmailFormInput disabled />

                        <PasswordInput
                            noRegexValidation
                            disabled={loading} />

                        <Form.Item wrapperCol={{ offset: 8, span: 10 }}>
                            <Button htmlType='submit' type='primary' loading={loading}>
                                Absenden
                            </Button>
                        </Form.Item>

                    </Form>
                </Content>
            </Layout>
        </>
    );
}

export default VerifyResetPassword;