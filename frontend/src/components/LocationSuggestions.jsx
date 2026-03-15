import React from 'react'

const categoryMeta = {
    airport: { icon: 'ri-plane-line', label: 'Airports Nearby', color: 'text-blue-600', bg: 'bg-blue-50' },
    train_station: { icon: 'ri-train-line', label: 'Train Stations Nearby', color: 'text-purple-600', bg: 'bg-purple-50' },
}

const SkeletonItem = () => (
    <div className='flex items-center gap-3 p-3 animate-pulse'>
        <div className='h-10 w-10 rounded-xl bg-gray-200 flex-shrink-0' />
        <div className='flex-1'>
            <div className='h-3 w-2/3 bg-gray-200 rounded mb-2' />
            <div className='h-2.5 w-1/2 bg-gray-100 rounded' />
        </div>
        <div className='h-3 w-10 bg-gray-200 rounded' />
    </div>
)

const PlaceItem = ({ place, onSelect }) => (
    <button
        type='button'
        onClick={() => onSelect(place)}
        className='flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 text-left group'
    >
        <div className='h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-100 transition-colors'>
            <i className='ri-map-pin-2-fill text-gray-600 group-hover:text-yellow-600 transition-colors'></i>
        </div>
        <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold text-gray-900 truncate'>{place.name}</p>
            <p className='text-xs text-gray-500 truncate mt-0.5'>{place.vicinity}</p>
        </div>
        <div className='flex-shrink-0 text-right'>
            <p className='text-xs font-bold text-gray-700'>{place.distanceKm.toFixed(1)} km</p>
            <p className='text-xs text-gray-400'>away</p>
        </div>
    </button>
)

const SuggestionSection = ({ type, places, loading, onSelect }) => {
    const meta = categoryMeta[type] ?? categoryMeta.airport

    return (
        <div>
            <div className='flex items-center gap-2 mb-2 px-1'>
                <div className={`h-6 w-6 rounded-lg ${meta.bg} flex items-center justify-center`}>
                    <i className={`${meta.icon} ${meta.color} text-xs`}></i>
                </div>
                <p className='text-xs font-bold text-gray-500 uppercase tracking-wider'>{meta.label}</p>
            </div>

            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                {loading ? (
                    <>
                        <SkeletonItem />
                        <div className='h-px bg-gray-50 mx-3' />
                        <SkeletonItem />
                        <div className='h-px bg-gray-50 mx-3' />
                        <SkeletonItem />
                    </>
                ) : places.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-6 gap-2'>
                        <i className={`${meta.icon} text-2xl text-gray-300`}></i>
                        <p className='text-xs text-gray-400'>None found within 10 km</p>
                    </div>
                ) : (
                    places.map((place, idx) => (
                        <React.Fragment key={place.placeId ?? idx}>
                            <PlaceItem place={place} onSelect={onSelect} />
                            {idx < places.length - 1 && <div className='h-px bg-gray-50 mx-3' />}
                        </React.Fragment>
                    ))
                )}
            </div>
        </div>
    )
}

const LocationSuggestions = ({ airports, stations, loadingAirports, loadingStations, onSelect, visible }) => {
    if (!visible) return null

    return (
        <div className='flex flex-col gap-4 animate-fadeIn'>
            <SuggestionSection
                type='airport'
                places={airports}
                loading={loadingAirports}
                onSelect={onSelect}
            />
            <SuggestionSection
                type='train_station'
                places={stations}
                loading={loadingStations}
                onSelect={onSelect}
            />
        </div>
    )
}

export default LocationSuggestions
