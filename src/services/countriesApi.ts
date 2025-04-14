import axios from 'axios';
import { Country, CountrySummary } from '../types/country'; 

const API_URL = 'https://restcountries.com/v3.1';

/**
 * Получает список всех стран с основными полями.
 * @returns Promise<CountrySummary[]>
 */
export const getAllCountries = async (): Promise<CountrySummary[]> => {
    try {
        //запрашиваем только нужные поля для оптимизации
        const response = await axios.get<CountrySummary[]>(`${API_URL}/all?fields=name,cca3,flags`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке списка стран:", error);
        throw error; //проброс ошибки
    }
};

/**
 * Получает детальную информацию о стране по ее CCA3 коду.
 * @param code - Трехбуквенный код страны (CCA3)
 * @returns Promise<Country | null>
 */
export const getCountryByCode = async (code: string): Promise<Country | null> => {
    try {
        const response = await axios.get<Country[]>(`${API_URL}/alpha/${code}`);
        //api возвращает массив с одним элементом
        return response.data[0] || null;
    } catch (error) {
        console.error(`Ошибка при загрузке данных для страны ${code}:`, error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null; //страна не найдена
        }
        throw error;
    }
};

/**
 * Ищет страны по частичному или полному названию.
 * @param name - Название страны для поиска
 * @returns Promise<CountrySummary[]>
 */
export const searchCountriesByName = async (name: string): Promise<CountrySummary[]> => {
    if (!name.trim()) {
        //если строка поиска пуста, возвращаем все страны
        return getAllCountries();
    }
    try {
        //запрашиваем только нужные поля
        const response = await axios.get<CountrySummary[]>(`${API_URL}/name/${name}?fields=name,cca3,flags`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при поиске стран по имени '${name}':`, error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return []; //ничего не найдено
        }
        throw error;
    }
}; 