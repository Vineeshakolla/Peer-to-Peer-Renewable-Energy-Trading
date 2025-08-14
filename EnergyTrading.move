module et::EnergyTrading {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use std::vector;
    use std::option;

    struct Listing has store {
        id: u64,
        producer: address,
        kwh: u64,
        price_per_kwh: u64,
        remaining: u64,
        sold: bool,
        buyer: option::Option<address>
    }

    struct ProducerListings has key {
        list: vector<Listing>
    }

    public fun init_producer_storage(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<ProducerListings>(addr)) {
            move_to(account, ProducerListings { list: vector::empty<Listing>() });
        }
    }

    public fun list_surplus(producer: &signer, kwh: u64, price_per_kwh: u64) {
        let addr = signer::address_of(producer);

        if (!exists<ProducerListings>(addr)) {
            move_to(producer, ProducerListings { list: vector::empty<Listing>() });
        }

        let pl_ref = borrow_global_mut<ProducerListings>(addr);
        let new_id = (vector::length(&pl_ref.list)) + 1;

        let listing = Listing {
            id: new_id,
            producer: addr,
            kwh,
            price_per_kwh,
            remaining: kwh,
            sold: false,
            buyer: option::none<address>()
        };

        vector::push_back(&mut pl_ref.list, listing);
    }

    public fun buy_listing(buyer: &signer, producer_addr: address, listing_index: u64) acquires ProducerListings {
        assert!(exists<ProducerListings>(producer_addr), 1);
        let pl_ref = borrow_global_mut<ProducerListings>(producer_addr);
        let len = vector::length(&pl_ref.list);
        assert!(listing_index < len, 2);

        let listing_ref = vector::borrow_mut(&mut pl_ref.list, listing_index);

        assert!(!listing_ref.sold, 3);
        assert!(listing_ref.remaining > 0, 4);

        let units = listing_ref.remaining;
        let price_per_unit = listing_ref.price_per_kwh;
        let total_cost = units * price_per_unit;

        let payment = coin::withdraw<AptosCoin>(buyer, total_cost);
        coin::deposit<AptosCoin>(listing_ref.producer, payment);

        listing_ref.remaining = 0;
        listing_ref.sold = true;
        listing_ref.buyer = option::some(signer::address_of(buyer));
    }

    public fun dummy_read() {
    }
}
