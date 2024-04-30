import React, { useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useErrors } from "../../hooks/Hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const NewGroup = () => {
  const dispatch = useDispatch();
  const { isNewGroup } = useSelector((state) => state.misc);
  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoaderNayaGrp, setIsLoaderNayaGrp] = useState(false);

  const { isError, error, isLoading, data } = useAvailableFriendsQuery();
  const [nayaGroup] = useNewGroupMutation();

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const selectMemberHandler = (_id) => {
    setSelectedMembers((prev) =>
      prev.includes(_id)
        ? prev.filter((currElement) => currElement !== _id)
        : [...prev, _id]
    );
  };
  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  const submitHandler = async () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    //creating a new Group
    setIsLoaderNayaGrp(true);
    const toastId = toast.loading("Creating Group");
    try {
      const res = await nayaGroup({
        name: groupName.value,
        members: selectedMembers,
      });
      if (res.data) {
        toast.success(res.data.message || "Updated data successfully", {
          id: toastId,
        });
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoaderNayaGrp(false);
    }

    closeHandler();
  };

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          Notifications
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />

        <Typography variant="body1">Members</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          )}
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="text"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={isLoaderNayaGrp}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
