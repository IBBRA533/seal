// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Card, Container, Flex, Grid } from '@radix-ui/themes';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreateAllowlist } from './CreateAllowlist';
import { Allowlist } from './Allowlist';
import WalrusUpload from './EncryptAndUpload';
import { useState } from 'react';
import { CreateService } from './CreateSubscriptionService';
import FeedsToSubscribe from './SubscriptionView';
import { Service } from './SubscriptionService';
import { AllAllowlist } from './OwnedAllowlists';
import { AllServices } from './OwnedSubscriptionServices';
import Feeds from './AllowlistView';
import { Button } from '@/components/ui/button';

function LandingPage() {
  const cardData = [
    {
      title: 'Allowlist Example',
      description:
        'Shows how a creator can define an allowlist based access. The creator first creates an allowlist and can add or remove users in the list. The creator can then associate encrypted files to the allowlist. Only users in the allowlist have access to decrypt the files.',
      link: '/allowlist-example',
    },
    {
      title: 'Subscription Example',
      description:
        'Shows how a creator can define a subscription based access to its published files. The creator defines subcription fee and how long a subscription is valid for. Only users with a valid subscription NFT can access and decrypt the files.',
      link: '/subscription-example',
    },
  ];

  return (
    <Grid columns="2" gap="6">
      {cardData.map((card, index) => (
        <div key={index}>
          <Card className="p-6 rounded-2xl shadow-md hover:shadow-xl">
            <Flex direction="column" gap="4" align="center" justify="between" style={{ height: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
              <Link to={card.link}>
                <Button className="mt-4" size="lg">
                  Try it
                </Button>
              </Link>
            </Flex>
          </Card>
        </div>
      ))}
    </Grid>
  );
}

function App() {
  const currentAccount = useCurrentAccount();
  const [recipientAllowlist, setRecipientAllowlist] = useState<string>('');
  const [capId, setCapId] = useState<string>('');

  return (
    <Container className="py-6">
      <Flex position="sticky" px="4" py="2" justify="between" className="mb-6">
        <h1 className="text-4xl font-bold">Seal Example Apps</h1>
        <ConnectButton />
      </Flex>

      <Card className="mb-6 p-4">
        <p>
          1. Code is available <a className="text-blue-600 underline" href="https://github.com/MystenLabs/seal/tree/main/examples">here</a>.
        </p>
        <p>
          2. Use Testnet wallet with balance. Request from <a className="text-blue-600 underline" href="https://faucet.sui.io/">faucet.sui.io</a>.
        </p>
        <p>
          3. Files stored on Walrus Testnet for 1 epoch only.
        </p>
        <p>
          4. Only image files supported for demo.
        </p>
      </Card>

      {currentAccount ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/allowlist-example/*"
              element={
                <Routes>
                  <Route path="/" element={<CreateAllowlist />} />
                  <Route
                    path="/admin/allowlist/:id"
                    element={
                      <div>
                        <Allowlist setRecipientAllowlist={setRecipientAllowlist} setCapId={setCapId} />
                        <WalrusUpload policyObject={recipientAllowlist} cap_id={capId} moduleName="allowlist" />
                      </div>
                    }
                  />
                  <Route path="/admin/allowlists" element={<AllAllowlist />} />
                  <Route path="/view/allowlist/:id" element={<Feeds suiAddress={currentAccount.address} />} />
                </Routes>
              }
            />
            <Route
              path="/subscription-example/*"
              element={
                <Routes>
                  <Route path="/" element={<CreateService />} />
                  <Route
                    path="/admin/service/:id"
                    element={
                      <div>
                        <Service setRecipientAllowlist={setRecipientAllowlist} setCapId={setCapId} />
                        <WalrusUpload policyObject={recipientAllowlist} cap_id={capId} moduleName="subscription" />
                      </div>
                    }
                  />
                  <Route path="/admin/services" element={<AllServices />} />
                  <Route path="/view/service/:id" element={<FeedsToSubscribe suiAddress={currentAccount.address} />} />
                </Routes>
              }
            />
          </Routes>
        </BrowserRouter>
      ) : (
        <p className="text-center text-lg text-gray-500">Please connect your wallet to continue</p>
      )}
    </Container>
  );
}

export default App;
