import { useHttp } from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createSelector } from 'reselect'

import {heroDeleted, fetchHeroes, selectAll} from './heroesSlice'
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { useCallback } from 'react';


const HeroesList = () => {

  // Используем библиотеку createSelector, чтобы мемоизировать полученный объект из стора. Делаем это, что бы не было перерендеривания компонентов, при нажатии на один и тот же фильтер.
  const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    selectAll,
    (filter, heroes) => {
    if (filter === 'all') {
        return heroes;
    } else {
        return heroes.filter(item => item.element === filter);
    }
    }
  );

  const filteredHeroes = useSelector(filteredHeroesSelector);
  const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    dispatch(fetchHeroes());
  }, []);

  // Используем useCallback, ставим зависимость от request, чтобы при удалении компанент HeroesListItem не перерендеривался
  const deletHero = useCallback((id) => {

    request(`http://localhost:3001/heroes/${id}`, 'DELETE')
      .then(data => console.log(data))
      .then(dispatch(heroDeleted(id)))
      .catch(err => console.log(err))
  }, [request])

  if (heroesLoadingStatus === "loading") {
    return <Spinner />;
  } else if (heroesLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>
  }

  const renderHeroesList = (arr) => {
    if (arr.length === 0) {
      return <h5 className="text-center mt-5">Героев пока нет</h5>
    }

    return arr.map(({ id, ...props }) => {
      return <HeroesListItem key={id} {...props} onDelet={() => deletHero(id)} />
    })
  }

  const elements = renderHeroesList(filteredHeroes);
  return (
    <ul>
      {elements}
    </ul>
  )
}

export default HeroesList;