import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Alert, Descriptions, Typography, Image, Button, Row, Col, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getCountryByCode } from '../services/countriesApi';
import { Country } from '../types/country';

const { Title } = Typography;

const CountryDetailPage: React.FC = () => {
    //получаем параметр countryCode из URL
    const { countryCode } = useParams<{ countryCode: string }>();
    const navigate = useNavigate(); //для кнопки "Назад"

    //состояния компонента
    const [country, setCountry] = useState<Country | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    //загрузка данных о стране при изменении countryCode
    useEffect(() => {
        if (countryCode) {
            setLoading(true);
            setError(null);
            setCountry(null); //сбрасываем страну перед загрузкой новой
            getCountryByCode(countryCode)
                .then(data => {
                    if (data) {
                        setCountry(data);
                    } else {
                        setError('Страна с таким кодом не найдена.');
                    }
                })
                .catch(err => {
                    setError('Не удалось загрузить данные о стране.');
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            //если countryCode не определен
            setError('Код страны не указан в URL.');
            setLoading(false);
        }
    }, [countryCode]); //зависимость от countryCode

    //функция для форматирования числа (население, площадь)
    const formatNumber = (num: number): string => {
        return num.toLocaleString('ru-RU'); //используем локаль для форматирования
    };

    //функция для получения списка языков
    const getLanguages = (languages?: { [key: string]: string }): string => {
        if (!languages) return '-';
        return Object.values(languages).join(', ');
    };

    //функция для получения списка валют
    const getCurrencies = (currencies?: { [key: string]: { name: string; symbol: string } }): string => {
        if (!currencies) return '-';
        return Object.values(currencies)
            .map(c => `${c.name} (${c.symbol || ''})`) //добавим проверку на symbol
            .join(', ');
    };

    //отображение загрузки
    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
    }

    //отображение ошибки
    if (error) {
        return (
            <>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)} //возврат на предыдущую страницу
                    style={{ marginBottom: '20px' }}
                >
                    Назад к списку
                </Button>
                <Alert message="Ошибка" description={error} type="error" showIcon />
            </>
        );
    }

    //отображение, если страна не найдена (API вернул null)
    if (!country) {
         return (
            <>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: '20px' }}
                >
                    Назад к списку
                </Button>
                 <Alert message="Информация о стране недоступна" description="Страна с указанным кодом не найдена." type="warning" showIcon />
             </>
        );
    }

    //отображение детальной информации
    return (
        <>
            {/*Кнопка "Назад" по центру*/}
            <Row justify="center" style={{ marginBottom: '20px' }}>
                <Col>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)} //возврат на предыдущую страницу
                    >
                        Назад к списку
                    </Button>
                </Col>
            </Row>
            {/*Карточка с информацией*/} 
            <Card title={<Title level={2}>{country.name.official}</Title>}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                        <Image
                            width="100%"
                            style={{ maxWidth: '300px', border: '1px solid #f0f0f0' }}
                            src={country.flags.svg || country.flags.png} //предпочитаем SVG
                            alt={country.flags.alt || `Флаг ${country.name.common}`} //используем alt текст из API, если есть
                            preview={false} //отключаем предпросмотр по клику
                        />
                        <Title level={4} style={{ marginTop: '10px' }}>{country.name.common}</Title>
                    </Col>
                    <Col xs={24} md={16}>
                        <Descriptions bordered layout="vertical" column={{ xs: 1, sm: 2 }}>
                            <Descriptions.Item label="Официальное название">{country.name.official}</Descriptions.Item>
                            <Descriptions.Item label="Столица">{country.capital ? country.capital.join(', ') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="Население">{formatNumber(country.population)}</Descriptions.Item>
                            <Descriptions.Item label="Площадь">{formatNumber(country.area)} км²</Descriptions.Item>
                            <Descriptions.Item label="Языки">{getLanguages(country.languages)}</Descriptions.Item>
                            <Descriptions.Item label="Валюты">{getCurrencies(country.currencies)}</Descriptions.Item>
                            <Descriptions.Item label="Код страны (CCA3)"><Tag>{country.cca3}</Tag></Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>
        </>
    );
};

export default CountryDetailPage; 