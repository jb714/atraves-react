import { useState, useEffect } from 'react';
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
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    RadioGroup,
    Radio,
    Stack
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { createMessagesAtBothLocations, getMessagesNearLocation } from '../services/messageService';
import { Message } from '../types';
import { enablePersistence } from '../firebase';

type MessagesProps = {
    currentLat: number;
    currentLng: number;
    antipodeLat: number;
    antipodeLng: number;
}

const Messages = ({ currentLat, currentLng, antipodeLat, antipodeLng }: MessagesProps) => {
    const { t, i18n } = useTranslation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [showAntipode, setShowAntipode] = useState('antipode'); // 'antipode' or 'location'

    // Enable persistence when component mounts
    useEffect(() => {
        enablePersistence();
    }, []);

    const loadMessages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const location = showAntipode === 'antipode'
                ? { lat: antipodeLat, lng: antipodeLng }
                : { lat: currentLat, lng: currentLng };
            console.log('Loading messages for location:', location);
            const messages = await getMessagesNearLocation({
                location,
                radius: 20, // 20km for debugging
                limit: 10
            });
            setMessages(messages);
        } catch (err) {
            setError(t('messages.error.loading'));
            console.error('Error loading messages:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Load messages when location or toggle changes
    useEffect(() => {
        loadMessages();
    }, [currentLat, currentLng, antipodeLat, antipodeLng, showAntipode]);

    const handleLeaveMessage = async () => {
        if (!message.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            await createMessagesAtBothLocations(
                message.trim(),
                { lat: currentLat, lng: currentLng },
                { lat: antipodeLat, lng: antipodeLng },
                i18n.language
            );

            toast({
                title: t('messages.toast.sent.title'),
                description: t('messages.toast.sent.description'),
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setMessage('');
            onClose();
            setTimeout(() => {
                loadMessages();
            }, 1000);
        } catch (err) {
            setError(t('messages.error.sending'));
            console.error('Error sending message:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckForMessages = () => {
        loadMessages();
    };

    return (
        <Box 
            mt={8} 
            p={6} 
            bg="white" 
            borderRadius="12px" 
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.100"
        >
            <VStack spacing={3} align="stretch">
                <Text fontSize="lg" fontWeight="medium" mb={-1}>
                    📦 {t('messages.title')}
                </Text>
                <Alert
                    bg="#d1f7e8"
                    borderRadius="12px"
                    fontSize="sm"
                    border="1px solid"
                    borderColor="#a7f3d0"
                    py={2.5}
                    px={3}
                >
                    <AlertIcon color="green.600" />
                    <AlertDescription color="gray.800">
                        {t('messages.description')}
                    </AlertDescription>
                </Alert>
                <RadioGroup
                    onChange={setShowAntipode}
                    value={showAntipode}
                    mb={2}
                >
                    <Stack direction="row">
                        <Radio value="location">
                            {t('messages.messagesSeenFromOriginal')}
                            <Text fontSize="xs" color="gray.500" lineHeight="1.2">
                                ({currentLat.toFixed(4)}°, {currentLng.toFixed(4)}°)
                            </Text>
                        </Radio>
                        <Radio value="antipode">
                            {t('messages.messagesSeenAtAntipode')}
                            <Text fontSize="xs" color="gray.500" lineHeight="1.2">
                                ({antipodeLat.toFixed(4)}°, {antipodeLng.toFixed(4)}°)
                            </Text>
                        </Radio>
                    </Stack>
                </RadioGroup>

                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>{t('messages.error.title')}</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isLoading ? (
                    <Box textAlign="center" py={4}>
                        <Spinner />
                    </Box>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {messages.length === 0 ? (
                            <Box textAlign="center" py={8}>
                                <Text fontSize="4xl" mb={3}>🌊</Text>
                                <Text color="gray.600" mb={2} fontStyle="italic" fontSize="lg">
                                    No bottles bobbing here — yet.
                                </Text>
                                <Text color="gray.500" mb={6} fontSize="sm">
                                    Be the first to cast a message into the digital ocean.
                                </Text>
                                <VStack spacing={2}>
                                    <Button
                                        bg="#ffb88c"
                                        color="white"
                                        onClick={onOpen}
                                        isLoading={isLoading}
                                        size="lg"
                                        _hover={{ 
                                            bg: "#ff994c", 
                                            transform: "translateY(-2px)", 
                                            boxShadow: "0 8px 25px -8px rgba(255, 153, 76, 0.6)" 
                                        }}
                                        transition="all 0.2s"
                                        borderRadius="12px"
                                    >
                                        ✍️ {t('messages.leaveMessage')}
                                    </Button>
                                    <Text fontSize="xs" color="gray.500" fontStyle="italic">
                                        {t('messages.tagline')}
                                    </Text>
                                </VStack>
                            </Box>
                        ) : (
                            <>
                                {messages.map((msg) => (
                                    <Box 
                                        key={msg.id} 
                                        p={4} 
                                        borderWidth="1px" 
                                        borderRadius="12px"
                                        bg={msg.isAntipode ? "blue.50" : "white"}
                                    >
                                        <Text>{msg.content}</Text>
                                        <Text fontSize="xs" color="gray.500" mt={2} lineHeight="1.3">
                                            {new Date(msg.timestamp).toLocaleString()}
                                            {msg.isAntipode && ` • ${t('messages.fromAntipode')}`}
                                        </Text>
                                    </Box>
                                ))}
                                <Box>
                                    <Button
                                        bg="#ffb88c"
                                        color="white"
                                        mr={4}
                                        onClick={onOpen}
                                        isLoading={isLoading}
                                        _hover={{ 
                                            bg: "#ff994c", 
                                            transform: "translateY(-2px)", 
                                            boxShadow: "0 6px 20px -8px rgba(255, 153, 76, 0.6)" 
                                        }}
                                        transition="all 0.2s"
                                        borderRadius="12px"
                                    >
                                        ✍️ {t('messages.leaveMessage')}
                                    </Button>
                                    <Button
                                        bg="transparent"
                                        color="#f78c45"
                                        border="2px solid"
                                        borderColor="#f78c45"
                                        onClick={handleCheckForMessages}
                                        isLoading={isLoading}
                                        _hover={{ 
                                            bg: "rgba(252, 174, 118, 0.15)", 
                                            borderColor: "#f78c45",
                                            transform: "translateY(-1px)"
                                        }}
                                        transition="all 0.2s"
                                        borderRadius="12px"
                                    >
                                        {t('messages.checkMessages')}
                                    </Button>
                                </Box>
                            </>
                        )}
                    </VStack>
                )}
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
                                bg="#ffb88c"
                                color="white"
                                onClick={handleLeaveMessage}
                                isDisabled={!message.trim() || isLoading}
                                isLoading={isLoading}
                                _hover={{ bg: "#ff994c" }}
                                borderRadius="12px"
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

export default Messages;