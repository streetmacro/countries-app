import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/reset.css'; //импорт стилей Ant Design
import HomePage from './pages/HomePage'; //Импортируем компонент главной страницы
import CountryDetailPage from './pages/CountryDetailPage'; //импортируем компонент страницы деталей
import './App.css'; 
const { Header, Content } = Layout;
const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {/*Header*/}
        <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#001529' }}>
          <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Страны Мира
          </div>
        </Header>
        {/*Основной контент*/} 
        <Content style={{ padding: '20px 50px' }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: '8px', minHeight: 'calc(100vh - 180px)' }}> {/* добавим minHeight для контента */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/country/:countryCode" element={<CountryDetailPage />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
