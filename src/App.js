import React, { useState, useEffect } from 'react';
import { auth, provider } from './firebase/firebase';
import { onAuthStateChanged, signOut, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function TheSpot() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <MainApp user={user} setUser={setUser} currentPage={currentPage} setCurrentPage={setCurrentPage} />
  );
}

function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900">
      <header className="flex justify-between items-center px-8 py-6">
        <div className="text-3xl font-bold text-white">The Spot</div>
        <div className="flex gap-4">
          <button onClick={() => { setShowAuth(true); setIsSignUp(false); }} className="px-6 py-2 text-white hover:opacity-80 transition">Sign In</button>
          <button onClick={() => { setShowAuth(true); setIsSignUp(true); }} className="px-6 py-2 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition">Get Started</button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h1 className="text-6xl font-bold text-white mb-6">Share Your Perfect Trip</h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">Create and share itineraries from your trips. Whether it's a day in DC or a month in Japan, help others plan their adventures.</p>
        <button onClick={() => { setShowAuth(true); setIsSignUp(true); }} className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition">Start Planning</button>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white hover:bg-opacity-20 transition">
            <h3 className="text-2xl font-bold mb-3">Create Itineraries</h3>
            <p className="text-gray-300">Share your trips day-by-day with spots you visited and why you loved them</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white hover:bg-opacity-20 transition">
            <h3 className="text-2xl font-bold mb-3">Discover Trips</h3>
            <p className="text-gray-300">Find real itineraries from real travelers planning their next adventure</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white hover:bg-opacity-20 transition">
            <h3 className="text-2xl font-bold mb-3">Plan Better</h3>
            <p className="text-gray-300">Save and customize itineraries to create your perfect trip</p>
          </div>
        </div>
      </section>

      {showAuth && <AuthModal isSignUp={isSignUp} setShowAuth={setShowAuth} setIsSignUp={setIsSignUp} />}
    </div>
  );
}

function AuthModal({ isSignUp, setShowAuth, setIsSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      setShowAuth(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowAuth(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
          <button onClick={() => setShowAuth(false)} className="text-gray-500 text-2xl">×</button>
        </div>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <button onClick={handleGoogleAuth} disabled={loading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 mb-4 disabled:opacity-50">Continue with Google</button>
        <div className="relative mb-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or</span></div></div>
        <div className="space-y-4">
          {isSignUp && <input type="text" placeholder="Full Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
          <button onClick={handleEmailAuth} disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}</button>
        </div>
        <div className="text-center text-gray-600 mt-6"><p>{isSignUp ? 'Already have an account?' : "Don't have an account?"} <button onClick={() => setIsSignUp(!isSignUp)} className="text-purple-600 font-bold hover:underline">{isSignUp ? 'Sign In' : 'Sign Up'}</button></p></div>
      </div>
    </div>
  );
}

function MainApp({ user, setUser, currentPage, setCurrentPage }) {
  const [itineraries, setItineraries] = useState([
    { id: 1, title: 'Best Brunch in DC', destination: 'Washington DC', tripType: 'one-day', startSpot: 'Downtown DC', endSpot: 'Georgetown', creator: 'Sarah', spots: [{ name: 'Rose Luxury', order: 1, description: 'Amazing brunch spot with incredible views', time: '1.5 hours' }], rating: 4.8, saves: 245 },
    { id: 2, title: 'NYC Weekend', destination: 'New York City', tripType: 'multiple', startSpot: 'Manhattan', endSpot: 'Brooklyn', creator: 'Mike', spots: [{ name: 'Times Square', order: 1, description: 'Iconic spot', time: '2 hours' }], rating: 4.5, saves: 180 },
  ]);
  const [newItinerary, setNewItinerary] = useState({ title: '', destination: '', tripType: 'one-day', spots: [] });
  const [newSpot, setNewSpot] = useState({ name: '', description: '', time: '' });
  const [viewingItinerary, setViewingItinerary] = useState(null);
  
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [tripTypeFilter, setTripTypeFilter] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [showArticleParser, setShowArticleParser] = useState(false);
  const [articleText, setArticleText] = useState('');
  const [parsingLoading, setParsingLoading] = useState(false);
  const [parsingError, setParsingError] = useState('');
  const [savedTrips, setSavedTrips] = useState([]);

  const addSpotToItinerary = () => {
    if (newSpot.name && newSpot.description) {
      setNewItinerary({
        ...newItinerary,
        spots: [...newItinerary.spots, { ...newSpot, order: newItinerary.spots.length + 1 }]
      });
      setNewSpot({ name: '', description: '', time: '' });
    }
  };

  const createItinerary = () => {
    if (newItinerary.title && newItinerary.destination && newItinerary.spots.length > 0) {
      setItineraries([...itineraries, {
        id: Date.now(),
        title: newItinerary.title,
        destination: newItinerary.destination,
        tripType: newItinerary.tripType,
        startSpot: newItinerary.startSpot || '',
        endSpot: newItinerary.endSpot || '',
        spots: newItinerary.spots,
        creator: user.displayName,
        rating: 5,
        saves: 0
      }]);
      setNewItinerary({ title: '', destination: '', tripType: 'one-day', spots: [] });
      setCurrentPage('discover');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const filteredItineraries = itineraries.filter(trip => {
    const matchesTo = !toLocation || trip.destination.toLowerCase().includes(toLocation.toLowerCase());
    const matchesTripType = !tripTypeFilter || trip.tripType === tripTypeFilter;
    return matchesTo && matchesTripType;
  });

  const clearFilters = () => {
    setFromLocation('');
    setToLocation('');
    setTripTypeFilter('');
    setTripDate('');
    setStartDate('');
    setEndDate('');
  };

  const saveTrip = (trip) => {
    if (!savedTrips.find(t => t.id === trip.id)) {
      setSavedTrips([...savedTrips, trip]);
    }
  };

  const unsaveTrip = (tripId) => {
    setSavedTrips(savedTrips.filter(t => t.id !== tripId));
  };

  const isTripSaved = (tripId) => {
    return savedTrips.some(t => t.id === tripId);
  };

  const parseArticleWithAI = async () => {
    if (!articleText.trim()) {
      setParsingError('Please paste an article first');
      return;
    }

    setParsingLoading(true);
    setParsingError('');

    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_AI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Extract trip itinerary information from this article. Return JSON with: title, destination, duration, and an array of spots (each with name, description, time). 

Article: ${articleText}

Return ONLY valid JSON, no other text.`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        setParsingError('Could not extract trip info. Try a different article.');
        setParsingLoading(false);
        return;
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      setNewItinerary({
        title: parsed.title || 'My Trip',
        destination: parsed.destination || '',
        duration: parsed.duration || '',
        spots: parsed.spots || []
      });

      setShowArticleParser(false);
      setArticleText('');
      setCurrentPage('create');
    } catch (error) {
      setParsingError('Error parsing article. Check your API key.');
      console.error(error);
    } finally {
      setParsingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-600">The Spot</div>
          <div className="flex gap-6 items-center">
            <button onClick={() => setCurrentPage('discover')} className={`font-semibold transition ${currentPage === 'discover' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>Discover</button>
            <button onClick={() => setCurrentPage('create')} className={`font-semibold transition ${currentPage === 'create' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>Create</button>
            <button onClick={() => setCurrentPage('saved')} className={`font-semibold transition ${currentPage === 'saved' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>Saved</button>
            <button onClick={() => setCurrentPage('mytrips')} className={`font-semibold transition ${currentPage === 'mytrips' ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}>My Trips</button>
            <span className="text-gray-700">{user.displayName}</span>
            <button onClick={handleSignOut} className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600">Sign Out</button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {currentPage === 'discover' && (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Discover Trips</h1>
            
            {!viewingItinerary && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Where do you want to go?</label>
                    <input type="text" placeholder="e.g., New York City, Paris, DC..." value={toLocation} onChange={(e) => setToLocation(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-lg" />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">How long?</label>
                    <select value={tripTypeFilter} onChange={(e) => setTripTypeFilter(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-lg">
                      <option value="">Any length</option>
                      <option value="one-day">Day trip</option>
                      <option value="multiple">Weekend or longer</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={clearFilters} className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">Clear</button>
                    <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-lg">Search</button>
                  </div>
                </div>

                {tripTypeFilter === 'one-day' && (
                  <div className="mt-4 pt-4 border-t">
                    <label className="block text-gray-700 font-semibold mb-2">Select Date</label>
                    <input type="date" value={tripDate} onChange={(e) => setTripDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
                  </div>
                )}

                {tripTypeFilter === 'multiple' && (
                  <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {!viewingItinerary && (
              <div>
                <p className="text-gray-600 mb-6">Found {filteredItineraries.length} trip{filteredItineraries.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredItineraries.map(trip => (
                    <div key={trip.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden">
                      <div className="bg-gradient-to-br from-purple-400 to-indigo-600 h-32 flex items-center justify-center text-4xl font-bold text-white">{trip.destination[0]}</div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                        <p className="text-gray-600 mb-2">{trip.destination}</p>
                        <p className="text-sm text-gray-500 mb-4">{trip.tripType === 'one-day' ? '📍 One Day' : '📍 Multiple Days'} | {trip.spots.length} stops</p>
                        <p className="text-xs text-gray-400 mb-4">{trip.startSpot} → {trip.endSpot}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-yellow-500 font-bold">Rating {trip.rating}</span>
                          <span className="text-purple-600 font-semibold">{trip.saves} saves</span>
                        </div>
                        <button onClick={() => setViewingItinerary(trip)} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">View Itinerary</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewingItinerary && (
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl">
                <button onClick={() => setViewingItinerary(null)} className="mb-6 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Back to Trips</button>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{viewingItinerary.title}</h2>
                <p className="text-gray-600 mb-1">{viewingItinerary.destination}</p>
                <p className="text-gray-500 mb-2">{viewingItinerary.tripType === 'one-day' ? '📍 One Day Trip' : '📍 Multiple Days'}</p>
                <p className="text-gray-500 mb-6">{viewingItinerary.startSpot} → {viewingItinerary.endSpot} | by {viewingItinerary.creator}</p>
                <div className="flex gap-6 mb-8">
                  <div className="text-yellow-500 font-bold">Rating {viewingItinerary.rating}</div>
                  <div className="text-purple-600 font-semibold">{viewingItinerary.saves} saves</div>
                  <button onClick={() => isTripSaved(viewingItinerary.id) ? unsaveTrip(viewingItinerary.id) : saveTrip(viewingItinerary)} className={`px-4 py-2 rounded-lg font-semibold ${isTripSaved(viewingItinerary.id) ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>{isTripSaved(viewingItinerary.id) ? '❤️ Saved' : '🤍 Save this Trip'}</button>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Stops on this trip ({viewingItinerary.spots.length})</h3>
                  {viewingItinerary.spots.map((spot) => (
                    <div key={spot.order} className="mb-6 pb-6 border-b">
                      <div className="flex items-start gap-4">
                        <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">{spot.order}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900">{spot.name}</h4>
                          <p className="text-gray-600 mb-2">{spot.description}</p>
                          <p className="text-sm text-gray-500">Time: {spot.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'create' && (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Create Your Itinerary</h1>
            <div className="mb-6 flex gap-4">
              <button onClick={() => setShowArticleParser(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">📄 Parse from Article</button>
            </div>
            {showArticleParser && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Parse Article with AI</h2>
                    <button onClick={() => setShowArticleParser(false)} className="text-gray-500 text-2xl">×</button>
                  </div>
                  <p className="text-gray-600 mb-4">Paste a travel article and AI will extract your itinerary</p>
                  {parsingError && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{parsingError}</div>}
                  <textarea value={articleText} onChange={(e) => setArticleText(e.target.value)} placeholder="Paste your travel blog post here..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 h-32 mb-4" />
                  <button onClick={parseArticleWithAI} disabled={parsingLoading} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">{parsingLoading ? 'Parsing...' : 'Parse Article'}</button>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Trip Title</label>
                  <input type="text" placeholder="e.g., Best Weekend in NYC" value={newItinerary.title} onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Destination</label>
                  <input type="text" placeholder="e.g., New York City" value={newItinerary.destination} onChange={(e) => setNewItinerary({ ...newItinerary, destination: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Trip Type</label>
                  <select value={newItinerary.tripType} onChange={(e) => setNewItinerary({ ...newItinerary, tripType: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600">
                    <option value="one-day">One Day Trip</option>
                    <option value="multiple">Multiple Days</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Start Spot</label>
                    <input type="text" placeholder="e.g., Downtown DC" value={newItinerary.startSpot || ''} onChange={(e) => setNewItinerary({ ...newItinerary, startSpot: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">End Spot</label>
                    <input type="text" placeholder="e.g., Georgetown" value={newItinerary.endSpot || ''} onChange={(e) => setNewItinerary({ ...newItinerary, endSpot: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Add Stops</h3>
                  <div className="space-y-4 mb-4">
                    <input type="text" placeholder="Spot name" value={newSpot.name} onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
                    <textarea placeholder="Why you loved it" value={newSpot.description} onChange={(e) => setNewSpot({ ...newSpot, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 h-20" />
                    <input type="text" placeholder="Time spent (e.g., 2 hours)" value={newSpot.time} onChange={(e) => setNewSpot({ ...newSpot, time: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
                    <button onClick={addSpotToItinerary} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Add Spot</button>
                  </div>
                  {newItinerary.spots.length > 0 && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-3">Your Spots ({newItinerary.spots.length})</h4>
                      {newItinerary.spots.map((spot, idx) => (
                        <div key={idx} className="mb-2 text-sm text-gray-700">{idx + 1}. {spot.name} - {spot.time}</div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={createItinerary} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg">Publish Itinerary</button>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'mytrips' && (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My Trips</h1>
            <p className="text-gray-600">You haven't created any itineraries yet. Start by visiting the Create page!</p>
          </div>
        )}

        {currentPage === 'saved' && (
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Saved Trips</h1>
            {savedTrips.length === 0 ? (
              <p className="text-gray-600">You haven't saved any trips yet. Explore and save your favorite itineraries!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedTrips.map(trip => (
                  <div key={trip.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden">
                    <div className="bg-gradient-to-br from-purple-400 to-indigo-600 h-32 flex items-center justify-center text-4xl font-bold text-white">{trip.destination[0]}</div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                      <p className="text-gray-600 mb-2">{trip.destination}</p>
                      <p className="text-sm text-gray-500 mb-2">{trip.tripType === 'one-day' ? '📍 One Day' : '📍 Multiple Days'} | {trip.spots.length} stops</p>
                      <p className="text-xs text-gray-400 mb-4">{trip.startSpot} → {trip.endSpot}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-yellow-500 font-bold">Rating {trip.rating}</span>
                        <span className="text-purple-600 font-semibold">{trip.saves} saves</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setViewingItinerary(trip)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">View</button>
                        <button onClick={() => unsaveTrip(trip.id)} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}