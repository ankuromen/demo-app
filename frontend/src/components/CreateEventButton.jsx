import { AddIcon } from '@chakra-ui/icons';
import { Button, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CreateEventButton = () => {
    const Navigate = useNavigate();
    return (
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        size={{ base: "sm", sm: "md" }}
        onClick={() => Navigate("/create")}
      >
        <AddIcon />
      </Button>
    );
}

export default CreateEventButton;
