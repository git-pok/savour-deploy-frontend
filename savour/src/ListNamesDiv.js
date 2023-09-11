import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxios from './hooks/useAxios.js';
import CreateListForm from './CreateListForm.js';
import AddToListForm from './AddToListForm.js';
import UserContext from './context/UserContext.js';
import SavourApi from './models/SavourApi.js';
import useToggleState from './hooks/useToggleState.js';
import './ListNamesDiv.css';

/**
 * ListNamesDiv
 * Props: urlEndpt, listTypeForH1, recipelist
 * Renders shopping or recipe lists.
*/
const ListNamesDiv = ({urlEndpt, listTypeForH1="Shoppinglists's", recipelist=false}) => {
  const { usrData, setUsrData } = useContext(UserContext);
  const headers = { _token: `Bearer ${usrData.token}`};
  const listUrl = `/users/${usrData.userId}/${urlEndpt}`;
  const [ listData, setListData ] = useState(null);
  const [ updatedList, setUpdatedList ] = useState(null);

  useEffect(() => {
    const getLists = async () => {
      const listReq = await SavourApi.request("get", listUrl, {}, {}, headers);
      setListData(() => listReq.data);
    }

    getLists();
  }, [listUrl, updatedList])

  return (
    <>
    <h1 className="ListNamesDiv-h1">{`${usrData && usrData.userUsername}'s ${listTypeForH1}`}</h1>
    <div className="ListNamesDiv">
      <div className="ListNamesDiv-div">
        { listData && listData.length ?
          listData.map(list => (
            <div key={list.id} className="ListNamesDiv-list-div">
              <Link exact="true" to={`/${urlEndpt}/${list.id}`}>
                <p>{list.list_name} {recipelist ? `for ${list.occasion}` : null}</p>
              </Link>
            </div>
          ))
        :
          <p>No Lists!</p>
        }
      </div>
    </div>

    <h1 className="ListNamesDiv-h1">Create a List</h1>
    <div className="ListNamesDiv-div">
      { !recipelist ?
        <AddToListForm setState={setListData} />
      :
        <CreateListForm recipelist={true} setState={setListData} />
      }
    </div>
    </>
  );
}

export default ListNamesDiv;