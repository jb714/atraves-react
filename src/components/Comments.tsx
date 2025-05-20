import { useState } from 'react';
import {
    Box,
    Button,
    Text,
    Textarea,
    VStack,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type CommentsProps = {
    currentLat: number;
    currentLng: number;
    antipodeLat: number;
    antipodeLng: number;
}

const Comments = ({ currentLat, currentLng, antipodeLat, antipodeLng }: CommentsProps) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const handleLeaveMessage = () => {
        // TODO: Implement message storage
        toast({
            title: t('messages.toast.sent.title'),
            description: t('messages.toast.sent.description'),
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        setMessage('');
        onClose();
    };

    const handleCheckForMessages = () => {
        // TODO: Implement message checking
        toast({
            title: t('messages.toast.notFound.title'),
            description: t('messages.toast.notFound.description'),
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box mt={8} p={4} borderTop="1px" borderColor="gray.200">
            <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="medium">
                    {t('messages.title')}
                </Text>
                <Text fontSize="sm" color="gray.600">
                    {t('messages.description')}
                </Text>
                <Box>
                    <Button
                        colorScheme="blue"
                        variant="outline"
                        mr={4}
                        onClick={onOpen}
                    >
                        {t('messages.leaveMessage')}
                    </Button>
                    <Button
                        colorScheme="blue"
                        variant="ghost"
                        onClick={handleCheckForMessages}
                    >
                        {t('messages.checkMessages')}
                    </Button>
                </Box>
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t('messages.modal.title')}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4}>
                            <Text fontSize="sm" color="gray.600">
                                {t('messages.modal.discoverableAt')}
                                <br />
                                ({antipodeLat.toFixed(4)}°, {antipodeLng.toFixed(4)}°)
                            </Text>
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t('messages.modal.placeholder')}
                                size="sm"
                                resize="vertical"
                                minH="100px"
                            />
                            <Button
                                colorScheme="blue"
                                onClick={handleLeaveMessage}
                                isDisabled={!message.trim()}
                            >
                                {t('messages.modal.send')}
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default Comments;