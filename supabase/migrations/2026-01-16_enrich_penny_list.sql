-- Hydrate Penny List with full enrichment for submitted SKUs
-- Adds/updates enrichment for 10 SKUs

insert into penny_item_enrichment (sku, item_name, brand, model_number, upc, image_url, home_depot_url, internet_sku, retail_price)
values
('1003431348', 'Spa 18.5 in. W x 16.25 in. D x 33.75 in. H Single Sink Bath Vanity in White with White Cultured Marble Top', 'Glacier Bay', 'PPSPAWHT18', '0094803148007', 'https://images.thdstatic.com/productImages/d7069cd6-a269-4b3c-bebd-af0f907029f0/svn/glacier-bay-bathroom-vanities-with-tops-ppspawht18-64_1000.jpg', 'https://www.homedepot.com/p/Glacier-Bay-Spa-18-5-in-W-x-16-25-in-D-x-33-75-in-H-Single-Sink-Bath-Vanity-in-White-with-White-Cultured-Marble-Top-PPSPAWHT18/305609813', 305609813, 259),
('1003431352', 'Spa 18.5 in. W x 16.25 in. D x 33.75 in. H Single Sink Bath Vanity in Dove Gray with White Cultured Marble Top', 'Glacier Bay', 'PPSPADVR18', '0094803148014', 'https://images.thdstatic.com/productImages/9debf1f8-210c-42cf-a211-7fdcb634f9a7/svn/glacier-bay-bathroom-vanities-with-tops-ppspadvr18-64_1000.jpg', 'https://www.homedepot.com/p/Glacier-Bay-Spa-18-5-in-W-x-16-25-in-D-x-33-75-in-H-Single-Sink-Bath-Vanity-in-Dove-Gray-with-White-Cultured-Marble-Top-PPSPADVR18/305609933', 305609933, 259),
('1005696963', 'Ambrose Low Voltage 2.4 Lumens Black Integrated LED Path Light with Flicker Flame Effect; Weather/Water/Rust Resistant', 'Hampton Bay', '62906', '0082392629069', 'https://images.thdstatic.com/productImages/383f1e56-6c96-4355-9f4c-3a20ea32403b/svn/black-hampton-bay-path-lights-62906-64_1000.jpg', 'https://www.homedepot.com/p/Hampton-Bay-Ambrose-Low-Voltage-2-4-Lumens-Black-Integrated-LED-Path-Light-with-Flicker-Flame-Effect-Weather-Water-Rust-Resistant-62906/313932828', 313932828, 34.97),
('1005758342', 'Attract with Magnetix 6-Spray Single Handle Shower Faucet 1.75 GPM in Spot Resist Brushed Nickel (Valve Included)', 'MOEN', '82975SRN', '0026508327081', 'https://images.thdstatic.com/productImages/ad80cd38-5abb-4421-9ed7-a4223a3c7427/svn/spot-resist-brushed-nickel-moen-shower-faucets-82975srn-64_1000.jpg', 'https://www.homedepot.com/p/MOEN-Attract-with-Magnetix-6-Spray-Single-Handle-Shower-Faucet-1-75-GPM-in-Spot-Resist-Brushed-Nickel-Valve-Included-82975SRN/314096221', 314096221, 188.1),
('1005913156', '3/16 in. Chainsaw File and Guide', 'Powercare', '316FGPC2', '0810003622129', 'https://images.thdstatic.com/productImages/4abf843c-37d4-4649-94c5-864440006c5a/svn/chainsaw-files-316fgpc2-64_1000.jpg', 'https://www.homedepot.com/p/3-16-in-Chainsaw-File-and-Guide-316FGPC2/315211740', 315211740, 10.47),
('1007635904', 'P.A.L. Pop-And-Lock Storage Bin', 'Traeger', 'BAC653', '0634868937750', 'https://images.thdstatic.com/productImages/1bf01c1c-4b0e-44d2-b937-6046c97a562e/svn/outdoor-cooking-accessories-bac653-64_1000.jpg', 'https://www.homedepot.com/p/P-A-L-Pop-And-Lock-Storage-Bin-BAC653/320013772', 320013772, 69.99),
('1007998619', 'Duncan 10 Lumen Bronze LED Weather Resistant Outdoor Solar Path Light with Plastic Lens', 'Hampton Bay', '32300-020', '0842674052387', 'https://images.thdstatic.com/productImages/c784c7fb-18a3-4011-bdb0-241af48b3908/svn/bronze-hampton-bay-path-lights-32300-020-64_1000.jpg', 'https://www.homedepot.com/p/Hampton-Bay-Duncan-10-Lumen-Bronze-LED-Weather-Resistant-Outdoor-Solar-Path-Light-with-Plastic-Lens-32300-020/320713672', 320713672, 4.47),
('1009933095', 'Prague Satin Nickel Entry Door Handle Only with Round Pismo Knob', 'Kwikset', '815PGHXPSKRDT15', '0883351855129', 'https://images.thdstatic.com/productImages/22c05545-fddc-4a57-bcca-0ac2c127e35d/svn/kwikset-knob-handlesets-815pghxpskrdt15-64_1000.jpg', 'https://www.homedepot.com/p/Kwikset-Prague-Satin-Nickel-Entry-Door-Handle-Only-with-Round-Pismo-Knob-815PGHXPSKRDT15/325649113', 325649113, 72.26),
('1014263974', '60 Watt-Equivalent A19 E26 Ultra Defnition LED Light Bulb Soft White 2,700 K 2-pack', 'Philips', '573477', '0046677573478', 'https://images.thdstatic.com/productImages/0c389970-1633-45e1-a78b-f65c3ded259e/svn/philips-led-light-bulbs-573477-64_1000.jpg', 'https://www.homedepot.com/p/Philips-60-Watt-Equivalent-A19-E26-Ultra-Defnition-LED-Light-Bulb-Soft-White-2-700-K-2-pack-573477/323293793', 323293793, null)
ON CONFLICT (sku) DO UPDATE SET
  item_name = EXCLUDED.item_name,
  brand = EXCLUDED.brand,
  model_number = EXCLUDED.model_number,
  upc = EXCLUDED.upc,
  image_url = EXCLUDED.image_url,
  home_depot_url = EXCLUDED.home_depot_url,
  internet_sku = EXCLUDED.internet_sku,
  retail_price = EXCLUDED.retail_price;
