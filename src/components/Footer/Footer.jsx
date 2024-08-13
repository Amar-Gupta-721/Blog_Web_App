import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <section className="relative overflow-hidden py-10 bg-neutral-900 text-neutral-50">
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                <div className="-m-6 flex flex-wrap">
                    <div className="w-full p-6 md:w-1/2 lg:w-5/12">
                        <div className="flex h-full flex-col justify-between">
                            <div className="mb-4 inline-flex items-center">
                                <Logo width="100px" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    &copy; Copyright 2023. All Rights Reserved by BLOG.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <div className="h-full text-neutral-50">
                            <ul>
                                <li className="mb-4 hover:text-neutral-400">
                                    <Link
                                        className=" text-base font-medium"
                                        to="/"
                                    >
                                        Features
                                    </Link>
                                </li>
                                <li className="mb-4 hover:text-neutral-400">
                                    <Link
                                        className=" text-base font-medium "
                                        to="/"
                                    >
                                        Pricing
                                    </Link>
                                </li>
                                <li className="mb-4 hover:text-neutral-400">
                                    <Link
                                        className=" text-base font-medium "
                                        to="/"
                                    >
                                        Affiliate Program
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <div className="h-full">
                            <ul>
                                <li className="mb-4 hover:text-neutral-400">
                                    <Link
                                        className=" text-base font-medium "
                                        to="/"
                                    >
                                        Help
                                    </Link>
                                </li>
                                <li className="mb-4 hover:text-neutral-400">
                                    <Link
                                        className=" text-base font-medium "
                                        to="mailto:amargupta721@gmail.com"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li className='hover:text-neutral-400'>
                                    <Link
                                        className=" text-base font-medium "
                                        to="/"
                                    >
                                        Customer Support
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full p-6 md:w-1/2 lg:w-3/12">
                        <div className="h-full">
                            <ul>
                                <li className="mb-4 hover:text-neutral-400">
                                    <Link
                                        className=" text-base font-medium "
                                        to="/"
                                    >
                                        Terms &amp; Conditions
                                    </Link>
                                </li>
                                <li className="mb-4 hover:text-neutral-400">
                                    <Link
                                        className=" text-base font-medium "
                                        to="/"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li className='hover:text-neutral-400'>
                                    <Link
                                        className=" text-base font-medium "
                                        to="/"
                                    >
                                        Licensing
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  )
}

export default Footer