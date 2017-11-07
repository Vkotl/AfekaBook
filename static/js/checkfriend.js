var checkInFriendsObj = { };

// Check if 'lonely' is located in 'friendly' friend array. 
checkInFriendsObj.checkInFriends = function(friendly, lonely)
{
    var isFriendly = false;
    
    friendly.friends.forEach(function(friend) 
    {
        if(friend.id.equals(lonely.id))
        {
            isFriendly = true;
        } 
    });
    return isFriendly;
} 

module.exports = checkInFriendsObj;
