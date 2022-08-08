import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore';
import {db} from '../firebase.config';
import Spinner from './Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const SliderComp = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
    const listingsRef = collection(db, 'listings');
    const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
    const querySnap = await getDocs(q);

    let listings = [];

    querySnap.forEach((doc) => {
      return listings.push({
      id: doc.id,
      data: doc.data()
      })
    })

    setListings(listings);
    setLoading(false);
    }

    fetchListings();
  
  }, []);

  if(loading) {
    return <Spinner/>
  }

  return listings && (
    <>
      <div className='profileHeader'>
        <p className="exploreHeading">Recommended Houses</p>
        <p className="exploreHeading" style={{color: '#999'}}>Slide for more</p>
      </div>
      <Swiper slidesPerView={1} pagination={{clickable: true}}>
        {listings.map(({data, id}) => (
          <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
            <div className="swiperSlideImg" style={{background: `url(${data.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover', width: '100%', height: '200px', borderRadius: '20px', cursor: 'pointer'}}>
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">${data.discountedPrice ?? data.regularPrice}
              {data.type === 'rent' && ' / month'}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default SliderComp