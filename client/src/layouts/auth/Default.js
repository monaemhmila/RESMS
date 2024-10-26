// Chakra imports
import { Box, Flex } from "@chakra-ui/react";
import Footer from "components/footer/FooterAuth";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";
import { Link } from "react-router-dom";
// Custom components
// Assets

function AuthIllustration(props) {
  const { children, illustrationBackground } = props;
  // Chakra color mode
  return (
    <Flex h='max-content'>

      <Flex
        h={{
          sm: "initial",
          md: "unset",
          lg: "100vh",
          xl: "97vh",
        }}
        w='100%'
        maxW={{ md: "66%", lg: "1313px" }}
        mx='auto'
        pt={{ sm: "50px", md: "0px" }}
        px={{ lg: "30px", xl: "0px" }}
        ps={{ xl: "70px" }}
        justifyContent='center'
        direction='column'>
        {children}
        <Box
  display={{ base: "none", md: "flex" }}
  h='100%'
  minH='100vh'
  w={{ lg: "50vw", "2xl": "44vw" }}
  borderBottomLeftRadius={{ lg: "120px", xl: "200px" }}
  justifyContent='center'
  position='absolute'
  flexDirection={'column'}
  alignItems={'center'}
  right='0px'
>
  <Link to="https://www.jemsit.com/#/home" target="_blank" style={{ height: '100%', width: '100%' }} >
    <Flex
      bg={`url(${illustrationBackground})`}
      justify='center'
      align='center'
      w='100%'
      h='100%'
      bgSize='contain' // Gardez l'image entière
      bgPosition='center' // Centrer l'image
      bgRepeat='no-repeat' // Évitez la répétition
      style={{ maxWidth: '60%', maxHeight: '60%', marginTop: '20%',}} // Taille plus petite et décalage vers la gauche
    />
  </Link>
</Box>

        <Footer />
      </Flex>
      {/* CHANGE THEME COLOR BUTTON LIGHT-DARK */}
      {/* <FixedPlugin /> */}
    </Flex>
  );
}
// PROPS

// AuthIllustration.propTypes = {
//   illustrationBackground: PropTypes.string,
//   image: PropTypes.any,
// };

export default AuthIllustration;
