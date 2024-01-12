import {combineReducers} from 'redux';
import signInReducer from '../screens/SignIn/reducers/signIn-reducer';
import signUpReducer from '../screens/SignUp/reducres/signUp-reducer';
import apartmentReducer from '../screens/Apartment/reducers/apartment-reducer';
import myDuesReducer from '../screens/MyDues/reducers/myDues-reducer';
import memberDetailsReducer from '../screens/MemberManagement/reducers/memberDetails-reducer';
import visitorReducer from '../screens/VisitorManager/reducers/apartment-reducer';
import memberVisitorReducer from '../screens/VisitorManager/reducers/visitor-reducer';
import parcelReducer from '../screens/VisitorManager/reducers/parcel-reducer';
import homeReducer from '../screens/Home/reducers/home-reducer';
import ticketReducer from '../screens/TicketManager/reducers/ticketManager-reducer';
import bookingFacilityReducer from '../screens/BookingFacility/reducers/booking-facility-reducer';

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

const appReducer = combineReducers({
  signInState: signInReducer,
  signUpState: signUpReducer,
  apartmentState: apartmentReducer,
  myDuesState: myDuesReducer,
  memberDetailsState: memberDetailsReducer,
  visitorState: visitorReducer,
  parcelState: parcelReducer,
  memberVisitorState: memberVisitorReducer,
  homeState: homeReducer,
  ticketState: ticketReducer,
  bookingFacilityState: bookingFacilityReducer,
});

export default rootReducer;
