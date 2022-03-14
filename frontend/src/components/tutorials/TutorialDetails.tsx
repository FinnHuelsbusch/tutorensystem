import { Button, Col, message, Modal, PageHeader, Row, Space, Tag, Tooltip, Typography } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequestError, getTutorial, markTutorial, participateInTutorial, unmarkTutorial } from '../../api/api';
import { AuthContext } from '../../context/UserContext';
import { AppRoutes } from '../../types/AppRoutes';
import { getErrorMessageString } from '../../types/RequestError';
import { Tutorial } from '../../types/Tutorial';
import { formatDate } from '../../utils/DateTimeHandling';
import { StarOutlined, StarFilled, WarningOutlined } from '@ant-design/icons'
import './TutorialDetails.scss';

const TutorialDetails: React.FC = () => {

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const [tutorial, setTutorial] = useState<Tutorial | undefined>();
    const [loading, setLoading] = useState(false);

    // get value of tutorialId URL parameter
    const { tutorialId } = useParams();

    useEffect(() => {
        if (tutorialId) {
            getTutorial(parseInt(tutorialId))
                .then(tutorial => setTutorial(tutorial))
                .catch(err => {
                    const reqErr = getRequestError(err);
                    message.error(getErrorMessageString(reqErr.errorCode));
                });
        }
    }, [tutorialId]);


    const TutorialDetailsPage = (tutorial: Tutorial) => {

        const getDetailsRow = (label: string, content: any) => {
            return (
                <Row>
                    <Col className="view-only-label" flex={"0 0 200px"}>{label}</Col>
                    <Col className="view-only-value" flex={"1 1 200px"}>{content}</Col>
                </Row>
            );
        };

        const onParticipateClick = () => {
            if (!tutorial) return;
            // if user is not logged in, redirect to login page
            if (tutorial.participates) {
                // show remove participation prompt
                Modal.confirm({
                    title: "Nicht mehr teilnehmen",
                    content: <div>
                        Hiermit melden Sie sich <b>verbindlich</b> von der Teilnahme am Tutorium '{tutorial.title}' ab.
                    </div>,
                    okText: 'Teilnahme entfernen (verbindlich)',
                    icon: <WarningOutlined color='red' />,
                    okButtonProps: { danger: true },
                    onOk() {
                        participateInTutorial(tutorial.id)
                            .then(res => {
                                message.success("Teilnahme erfolgreich");
                            }).catch(err => {
                                const reqErr = getRequestError(err);
                                message.error(getErrorMessageString(reqErr.errorCode));
                            });
                    }
                });
            } else {
                // show participate prompt
                Modal.confirm({
                    title: "Am Tutorium teilnehmen",
                    content: <div>
                        Hiermit melden Sie sich <b>verbindlich</b> zur Teilnahme am Tutorium '{tutorial.title}' an.
                    </div>,
                    okText: 'Teilnehmen (verbindlich)',
                    onOk() {
                        participateInTutorial(tutorial.id)
                            .then(res => {
                                message.success("Teilnahme erfolgreich");
                            }).catch(err => {
                                const reqErr = getRequestError(err);
                                message.error(getErrorMessageString(reqErr.errorCode));
                            });
                    }
                });
            }
        };

        const onMarkClick = () => {
            setLoading(true);
            if (tutorial.isMarked) {
                unmarkTutorial(tutorial.id)
                    .then(res => {
                        setTutorial({
                            ...tutorial,
                            isMarked: false
                        });
                        setLoading(false);
                    }).catch(err => {
                        const reqErr = getRequestError(err);
                        message.error(getErrorMessageString(reqErr.errorCode));
                        setLoading(false);
                    });
            } else {
                markTutorial(tutorial.id)
                    .then(res => {
                        setTutorial({
                            ...tutorial,
                            isMarked: true
                        });
                        setLoading(false);
                    }).catch(err => {
                        const reqErr = getRequestError(err);
                        message.error(getErrorMessageString(reqErr.errorCode));
                        setLoading(false);
                    });
            }
        };

        return (
            <>
                <PageHeader
                    ghost={false}
                    title={tutorial.title}
                    onBack={() => navigate(-1)}
                    extra={[
                        <Space wrap align='baseline'>
                            <Button
                                type='default'
                                disabled={loading}
                                onClick={e => onMarkClick()}>
                                {tutorial.isMarked
                                    ? <>
                                        <StarFilled style={{ color: '#ffd805' }} /> Vorgemerkt
                                    </>
                                    : <>
                                        <StarOutlined /> Vormerken
                                    </>
                                }
                            </Button>
                            <Button
                                type='primary'
                                danger={tutorial.participates ? true : false}
                                onClick={e => onParticipateClick()}>
                                {tutorial.participates ? "Nicht mehr teilnehmen" : "Am Tutorium teilnehmen"}
                            </Button>
                        </Space>
                    ]}
                >
                    <Typography style={{ marginTop: '16px' }}>
                        <Title level={4}>Inhalt</Title>
                        <Paragraph>{tutorial.description}</Paragraph>

                        <Title level={4}>Details</Title>
                        <Paragraph>
                            {getDetailsRow("Gesamtumfang",
                                `${tutorial.durationMinutes} Minuten`)}
                            {getDetailsRow("Zeitraum",
                                `${formatDate(tutorial.start)} - ${formatDate(tutorial.end)}`)}
                            {getDetailsRow("Anzahl Teilnehmer",
                                tutorial.numberOfParticipants)}
                            {getDetailsRow(tutorial.tutors.length > 1 ? "Tutoren" : "Tutor",
                                tutorial.tutors.map(t => `${t.firstName} ${t.lastName}`)
                                    .reduce((prev, curr) => `${prev} ${curr}`))}
                        </Paragraph>

                        <Title level={4}>Studienrichtungen</Title>
                        <Paragraph>
                            Für folgende Studienrichtungen ist dieses Tutorium geeignet:
                        </Paragraph>
                        <Paragraph>
                            {tutorial.specialisationCourses.map(specialisationCourse => (
                                <Tag>{specialisationCourse.course.abbreviation} {specialisationCourse.abbreviation}</Tag>
                            ))}
                        </Paragraph>
                    </Typography>
                </PageHeader>
            </>
        );
    };

    return (
        <>
            {tutorial && TutorialDetailsPage(tutorial)}
        </>
    );
};

export default TutorialDetails;