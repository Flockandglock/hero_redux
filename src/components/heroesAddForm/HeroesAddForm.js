import { useHttp } from '../../hooks/http.hook';
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { heroCreated } from '../heroesList/heroesSlice';
import { v4 as uuidv4 } from 'uuid';


const HeroesAddForm = () => {

  const {request} = useHttp();

  const [heroName, setHeroName] = useState('');
  const [heroDescr, setHeroDescr] = useState('');
  const [heroElem, setHeroElem] = useState('');

  const { filters, filtersLoadingStatus } = useSelector(state => state.filters);
  const dispatch = useDispatch();

  // Добавление нового перса в список. 1-отменяем перезагрузку страницы. 2-создаем переменную поля которой заполняют стейты, полученные из нашей контролируемой формы. Делаем запрос с методом POST. И в конце отчищаем наши, методом изменения стейта, где в качестве аргумента передаем пустую строку.
  const onSubmitHandler = (e) => {
    e.preventDefault();

    const newHero = {
        id: uuidv4(),
        name: heroName,
        description: heroDescr,
        element: heroElem
    }

    request('http://localhost:3001/heroes', 'POST', JSON.stringify(newHero))
    .then(dispatch(heroCreated(newHero)))
    .catch(err => console.log(err))
    
    setHeroName('');
    setHeroDescr('');
    setHeroElem('');
  }

  const renderFilters = (filters, status) => {
    if (status === 'loading') {
      return <option>Загрузка элементов</option>
    } else if (status === 'error') {
      return <option>Ошибка загрузки</option>
    }

    if (filters && filters.length > 0) {
      return filters.map(({name, label}) => {

        if (filters === 'all') return;

        return <option key={name} value={name}>{label}</option>
      })
    } 
  }

  return (
    <form className="border p-4 shadow-lg rounded"
      onSubmit={onSubmitHandler}
    >
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
        <input
          required
          type="text"
          name="name"
          value={heroName}
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
          onChange={(e) => setHeroName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">Описание</label>
        <textarea
          required
          name="text"
          value={heroDescr}
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          onChange={(e) => setHeroDescr(e.target.value)}
          style={{ "height": '130px' }} />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
        <select
          required
          className="form-select"
          id="element"
          name="element"
          value={heroElem}
          onChange={(e) => setHeroElem(e.target.value)}
        >
          <option >Я владею элементом...</option>
          {renderFilters(filters, filtersLoadingStatus)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">Создать</button>
    </form>
  )
}

export default HeroesAddForm;