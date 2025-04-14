import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Input, List, Pagination, Spin, Alert, Row, Col, Card, Typography } from 'antd';
import { getAllCountries, searchCountriesByName } from '../services/countriesApi';
import { CountrySummary } from '../types/country';
import { debounce } from 'lodash'; //для оптимизации поиска

const { Search } = Input;
const { Title } = Typography;

const PAGE_SIZE = 12; //количество стран на странице

const HomePage: React.FC = () => {
    //состояния компонента
    const [allCountries, setAllCountries] = useState<CountrySummary[]>([]); //все загруженные страны
    const [filteredCountries, setFilteredCountries] = useState<CountrySummary[]>([]); //страны после поиска/фильтрации
    const [loading, setLoading] = useState<boolean>(true); //индикатор загрузки
    const [error, setError] = useState<string | null>(null); //сообщение об ошибке
    const [currentPage, setCurrentPage] = useState<number>(1); //текущая страница пагинации
    const [searchTerm, setSearchTerm] = useState<string>(''); //значение в поле поиска

    //функция загрузки всех стран
    const fetchCountries = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllCountries();
            setAllCountries(data);
            setFilteredCountries(data); //изначально показываем все страны
        } catch (err) {
            setError('Не удалось загрузить список стран. Попробуйте позже.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //функция поиска стран
    const handleSearch = async (term: string) => {
        setLoading(true);
        setError(null);
        // setSearchTerm(term); // не обновляем searchTerm здесь, т.к. это делает onSearchChange
        setCurrentPage(1); //сбрасываем на первую страницу при поиске
        try {
            const data = await searchCountriesByName(term);
            setFilteredCountries(data);
        } catch (err) {
            setError('Ошибка при поиске стран.');
            setFilteredCountries([]); //очищаем список при ошибке
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //debounced версия handleSearch для оптимизации
    const debouncedSearch = useMemo(() => debounce(handleSearch, 300), []);

    //загрузка стран при монтировании компонента
    useEffect(() => {
        fetchCountries();
        //очистка debounce при размонтировании
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    //обработчик изменения значения в поле поиска
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value); //обновляем состояние searchTerm
        //если поле очищено, показываем все страны без задержки
        if (!value.trim()) {
            setLoading(true);
            setFilteredCountries(allCountries);
            setCurrentPage(1);
            setLoading(false);
            debouncedSearch.cancel(); //отменяем предыдущий запланированный поиск
        } else {
            setLoading(true); //показываем индикатор загрузки сразу
            debouncedSearch(value); //вызываем поиск с задержкой
        }
    };

    //обработчик смены страницы пагинации
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    //вычисляем, какие страны показывать на текущей странице
    const countriesToShow = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredCountries.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredCountries, currentPage]);

    return (
        <div>
            <Row justify="center" style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={18} md={12} lg={8}>
                    <Search
                        placeholder="Введите название страны... (латиница)"
                        onChange={onSearchChange}
                        value={searchTerm} //связываем с состоянием searchTerm
                        loading={loading && !!searchTerm} //показываем лоадер в поиске только при активном поиске
                        enterButton
                        allowClear
                        size="large"
                    />
                </Col>
            </Row>
            {/*показ общего лоадера только при первой загрузке */} 
            {loading && allCountries.length === 0 && <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />} 
            {error && <Alert message="Ошибка" description={error} type="error" showIcon style={{ marginBottom: '20px' }} />}

            {/*показ списка и пагинации, если нет ошибки и (загрузка завершена ИЛИ уже есть какие-то страны) */} 
            {!error && (loading || filteredCountries.length > 0) && (
                <>
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }} //адаптивная сетка
                        dataSource={countriesToShow}
                        loading={loading && searchTerm ? true : false} //передаем чистый boolean
                        renderItem={(country) => (
                            <List.Item>
                                <Link to={`/country/${country.cca3}`}> {/* ссылка на детальную страницу */}
                                    <Card
                                        hoverable
                                        cover={<img alt={`Флаг ${country.name.common}`} src={country.flags.png} style={{ height: 150, objectFit: 'cover' }} />}
                                        bodyStyle={{ padding: '10px' }}
                                    >
                                        <Card.Meta
                                            title={<Title level={5} style={{ marginBottom: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{country.name.common}</Title>}
                                        />
                                    </Card>
                                </Link>
                            </List.Item>
                        )}
                        locale={{ emptyText: 'Страны не найдены' }} //упрощаем текст для пустого списка
                    />
                    {/*пока пагинации если стран больше чем на одной странице и нет загрузки поиска */} 
                    {!loading && filteredCountries.length > PAGE_SIZE && (
                        <Row justify="center" style={{ marginTop: '20px' }}>
                            <Pagination
                                current={currentPage}
                                pageSize={PAGE_SIZE}
                                total={filteredCountries.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </Row>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage; 