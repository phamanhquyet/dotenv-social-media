import { appwriteConfig, databases } from "@/lib/appwrite/config";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Spinner,
} from "@nextui-org/react";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { AppwriteException, ID } from "appwrite";
import { communityStore } from "@/state/communityStore";

const CreateCommunity = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const communityState = communityStore();
  const { toast } = useToast();

  const handleSubmit = () => {
    setLoading(true);
    databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.communityCollectionId,
        ID.unique(),
        {
          name: name,
        }
      )
      .then((res) => {
        communityState.addCommunity(res);
        setLoading(false);
        toast({
          title: "Community added successfully",
        });
      })
      .catch((err: AppwriteException) => {
        setLoading(false);
        toast({
          title: err.message,
        });
      });
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="danger"
        className="shad-button_primary whitespace-nowrap">
        Create Community
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-blue-600/100">
                Create Community
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Name"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={handleSubmit}
                  disabled={loading}>
                  {loading ? <Spinner color="white" /> : "Submit"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCommunity;
