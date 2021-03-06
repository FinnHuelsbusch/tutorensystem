import { Button, Divider, Form, Input, Modal, Select, Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useContext, useEffect, useState } from 'react';
import { LockOutlined } from '@ant-design/icons';
import { CourseWithTitleAndLeaders, SpecialisationCourse } from '../../types/Course';
import { AuthContext } from '../../context/UserContext';
import EmailFormInput from '../inputs/EmailFormInput';
import ChangePasswordModal from './PasswordChangeModal';
import { UserRole } from '../../types/User';
import FormText from '../inputs/FormText';

const Settings: React.FC = () => {



    const mockCourse: CourseWithTitleAndLeaders = {
        title: "Wirtschaftsinformatik",
        id: 1,
        abbreviation: "WI",
        leadBy: [{
            email: "panda@baer.hui",
            jwt: "1234",
            loginExpirationDate: new Date("2022-03-08T20:51:46.558614"),
            refreshToken: "gibtsNicht",
            roles: [UserRole.ROLE_STUDENT]

        }]
    }

    const mockSpecialisationCourses: Array<SpecialisationCourse> = [
        {
            id: 1,
            title: "WWI 19 MA SE A",
            abbreviation: "WI",
            course: mockCourse
        },
        {
            id: 2,
            title: "WWI 19 MA SE B",
            abbreviation: "WI",
            course: mockCourse
        },
    ];

    const authContext = useContext(AuthContext);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    return (
        <>
            <Title level={1}>
                Einstellungen
            </Title>
            <Form
                name="login"
                labelCol={{ span: 8 }}
                initialValues={{ email: authContext.loggedUser?.email }}
                wrapperCol={{ span: 10 }}>
                <EmailFormInput disabled />
                <Form.Item
                    label="Passwort">
                    <Tooltip
                        title="Administratoren dürfen ihr Passwort nicht selbst ändern"
                        visible={authContext.hasRoles([UserRole.ROLE_ADMIN]) ? undefined : false}
                    >
                        <Button
                            type="default"
                            onClick={e => setShowChangePasswordModal(true)}
                            disabled={authContext.hasRoles([UserRole.ROLE_ADMIN])}>
                            <LockOutlined />Passwort ändern
                        </Button>
                    </Tooltip>
                </Form.Item>
                <Divider />
                <FormText
                    label="Vorname"
                    name="firstname"
                    rules={[{ required: false, message: 'Pflichtfeld' }]}>
                    <Input />
                </FormText>
                <FormText
                    label="Nachname"
                    name="lastname"
                    rules={[{ required: false, message: 'Pflichtfeld' }]}>
                    <Input />
                </FormText>
                <Form.Item
                    label="Kurs"
                    name="course"
                    rules={[{ required: true, message: 'Pflichtfeld' }]}>
                    <Select>
                        {mockSpecialisationCourses.map(course => (
                            <Select.Option
                                key={`${course.id}`}
                                value={`${course.title}`}>
                                {course.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 10 }}>
                    <Button htmlType='submit' type='primary'>
                        Aktualisieren
                    </Button>
                </Form.Item>
            </Form>

            <ChangePasswordModal
                visible={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)} />
        </>
    );
}

export default Settings;