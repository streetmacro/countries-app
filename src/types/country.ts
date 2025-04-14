//Определяем интерфейс для объекта валюты
interface Currency {
    code: string;
    name: string;
    symbol: string;
}

//определяем интерфейс для объекта языка
interface Language {
    iso639_1?: string; 
    iso639_2?: string; 
    name: string;      //название языка
    nativeName?: string; //родное название языка
}

//определяем основной интерфейс для данных страны
export interface Country {
    name: {
        common: string; //общее название
        official: string; //официальное название
    };
    cca3: string; //трехбуквенный код страны (для уникальности и роутинга)
    capital?: string[]; //столица (может быть несколько или отсутствовать)
    population: number; //население
    area: number; //площадь
    flags: {
        png: string; //uRL PNG флага
        svg: string; //uRL SVG флага
        alt?: string; //альтернативный текст для флага
    };
    languages?: { [key: string]: string }; //языки (ключ - код языка,значение - название)
    currencies?: { [key: string]: Currency }; //валюты (ключ - код валюты)
}

//тип для краткой информации о стране (дляс писка)
export interface CountrySummary {
    cca3: string;
    name: {
        common: string;
    };
    flags: {
        png: string;
        alt?: string;
    };
} 