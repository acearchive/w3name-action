⚠ **UNMAINTAINED**

*Since it is no longer being used for Ace Archive, I am not planning on
maintaining this tool. If you want to pick up maintenance, feel free to fork the
repo. Also check out
[pawanpaudel93/w3name-action](https://github.com/pawanpaudel93/w3name-action),
which does essentially the same thing.*

# w3name-action

This is a simple GitHub Action for publishing [IPNS
names](https://docs.ipfs.tech/concepts/ipns/) to
[w3name](https://web3.storage/docs/how-tos/w3name/) using the [client
library](https://github.com/web3-storage/w3name).

See the [action.yaml](./action.yaml) file for documentation of the input and
output parameters.

## Examples

```yaml
jobs:
  publish:
    name: "Publish IPNS name"
    runs-on: ubuntu-latest
    steps:
      - name: "Publish"
        # You will actually want to pin to a specific rev.
        uses: "acearchive/w3name-action@main"
        with:
          # You can generate a key with `ipfs key gen`.
          private-key: ${{ secrets.IPNS_KEY }}
          # This will probably actually come from a previous step.
          path: "/ipfs/bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze/wiki/Aardvark"
```
