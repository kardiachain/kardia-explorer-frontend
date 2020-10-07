import React, { useState } from 'react';
// import { useForm } from 'react-hook-form/dist/useForm';
import { Link } from 'react-router-dom';
import { Button, Col, FlexboxGrid, Form, FormControl, FormGroup } from 'rsuite';

const CreateByKeystore = () => {
    // const [password, setPassword] = useState('');
    
    // const { handleSubmit, register, errors } = useForm();
    // const onSubmit = (values: any) => console.log(values);

    // const handleGenerate = () => {
    //     // let wallet = EtherWallet.generate();
    //     // let privateKeyStr = wallet.getPrivateKeyString();
    //     // setPrivateKey(privateKeyStr);
    //     console.log(password);
        
    // }

    return (
        // <div className="show-grid creact-by-privatekey">
        //     <FlexboxGrid justify="start">
        //         <FlexboxGrid.Item componentClass={Col} colspan={22} md={14}>
        //             {/* <Form fluid>
        //                 <FormGroup>
        //                     <FormControl placeholder="Password*" name="password" value="1" type="text" />
        //                 </FormGroup>
        //             </Form> */}
        //             <form onSubmit={handleSubmit(onSubmit)}>
        //                 <input
        //                     name="email"
        //                     ref={register({
        //                     required: "Required",
        //                     pattern: {
        //                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        //                         message: "invalid email address"
        //                     }
        //                     })}
        //                 />
        //                 {errors.email && errors.email.message}

        //                 <input
        //                     name="username"
        //                     ref={register({
        //                     validate: (value: any) => value !== "admin" || "Nice try!"
        //                     })}
        //                 />
        //                 {errors.username && errors.username.message}

        //                 <button type="submit">Submit</button>
        //             </form>
        //         </FlexboxGrid.Item>
        //     </FlexboxGrid>
        //     <FlexboxGrid justify="start">
        //         <div className="note-warning button-container">
        //             <div> Remamber to save your password! </div>
        //             <div><b>You will need BOTH your Password + Keystore file to access your wallet</b></div>
        //         </div>
        //     </FlexboxGrid>
        //     <FlexboxGrid justify="start">
        //         <div className="button-container">
        //             <Link to="/wallet">
        //                 <Button appearance="ghost">Back</Button>
        //             </Link>
        //             <Button appearance="primary" onClick={handleGenerate}>Create wallet</Button>
        //         </div>
        //     </FlexboxGrid>
        // </div>
        <div>Create by key store</div>
    );
}

export default CreateByKeystore;
