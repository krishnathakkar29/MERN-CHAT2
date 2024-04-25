import React, { memo } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { sampleNotifications } from "../../constants/sampleData";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/Hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast, { Toaster } from "react-hot-toast";

const Notifications = () => {

  const dispatch = useDispatch()

  const {isNotification} = useSelector(state => state.misc)
  const { data, isError, error, isLoading } = useGetNotificationsQuery();

  const [acceptRequest] = useAcceptFriendRequestMutation()

  //errors
  useErrors([{ error, isError }]);

  //adding or rejecting friend
  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false))
    try {
      const res = await acceptRequest({requestId: _id, accept})

      if(res?.data?.success){
        //useSocket
        toast.success(res.data.message)
      }
      else{
        toast.error(res?.data?.message || "Somethig went wrong")
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.log(error)
    }
  };

  //close Handler
  const closeHandler = () => dispatch(setIsNotification(false))
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : data?.allRequests.length > 0 ? (
          data?.allRequests?.map(({ sender, _id }) => (
            <NotificationItem
              sender={sender}
              _id={_id}
              handler={friendRequestHandler}
              key={_id}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>0 notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar />

        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent you a friend request.`}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
