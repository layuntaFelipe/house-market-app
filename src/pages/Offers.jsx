import React, {useEffect, useState} from 'react';
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore';
import { db } from '../firebase.config';
import {toast} from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';
import logoHouse from '../assets/png/logoHouse.png';

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, 'listings');

      // Create a query
      const q = query(
      listingsRef, 
      where('offer', '==', true), 
      orderBy('timestamp', 'desc'), 
      limit(10)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible);

      const listings = [];
      querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data()
      })
      })

      setListings(listings);
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch Listings');
    }
    }

    fetchListings();
  }, [])

  const onFetchMoreListings = async () => {
    try {
      
      // Get reference
      const listingsRef = collection(db, 'listings');
      // Create a query
      const q = query(
        listingsRef, 
        where('offer', '==', true), 
        orderBy('timestamp', 'desc'), 
        startAfter(lastFetchedListing),
        limit(10)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible);
  
      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
  
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch Listings');
    }
  }

  return (
    <div className='category'>
      <header style={{display: 'flex', alignItems: 'center'}}>
        <img src={logoHouse} alt="" style={{width: '3.5rem', height: '3.5rem', marginRight: '1rem'}} />
        <p className="pageHeader">Explore</p>
      </header>

     {loading ? (
      <Spinner/>
     ) : listings && listings.length > 0 ? (
      <>
       <main>
        <ul className="categoryListings">
         {listings.map((listing) => (
          <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
         ))}
        </ul>
       </main>

       <br />
       <br />
       {lastFetchedListing && (
        <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
       )}
      </>
     ) : (
      <p>There are no current offers</p>
     )}
    </div>
  )
}

export default Offers